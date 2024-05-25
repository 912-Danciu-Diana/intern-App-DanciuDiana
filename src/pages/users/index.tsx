import { useEffect, useState } from 'react';
import { currentEnvironment } from '@constants';
import styles from './users.module.scss';

type Gender = 'female' | 'male' | '';

type User = {
  gender: Gender;
  login: {
    uuid: string;
  };
  name: {
    first: string;
    last: string;
  };
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [gender, setGender] = useState<Gender>('');
  const [pageToGet, setPageToGet] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(0);

  const getUsers = async (page: number, gender: Gender) => {
    setLoading(true);
    try {
      const result = await fetch(
        `${currentEnvironment.api.baseUrl}?results=5&gender=${gender}&page=${String(page)}`,
      );

      const json = await result.json();
      const usersResults = (await json.results) as User[];
      setUsers((oldUsers) => (page === 1 ? usersResults : [...oldUsers, ...usersResults]));
    } catch (error) {
      console.error('Error fetching users: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataUsers = async () => {
      await getUsers(pageToGet, gender);
    };

    fetchDataUsers().catch((err) => console.error(err));
  }, [pageToGet, triggerFetch]);

  useEffect(() => {
    // the if is neccessary because if the page is already set to 1 and the gender is changed
    // no changes will be shown because the first useEffect is not
    if (pageToGet === 1) {
      setTriggerFetch((old) => old + 1);
    }
    setPageToGet(1);
  }, [gender]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Users</div>
      <select
        id="gender"
        name="gender"
        className={styles.select}
        onChange={(event) => {
          setGender(event.target.value as Gender);
        }}
      >
        <option value="">All</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <ul className={styles.userList}>
          {users.length > 0
            ? users.map((user: User) => (
                <li key={user.login.uuid}>
                  {user.name.first} {user.name.last} ({user.gender})
                </li>
              ))
            : null}
        </ul>
      )}
      <button
        className={styles.loadButton}
        type="button"
        onClick={() => {
          setPageToGet((v) => v + 1);
        }}
      >
        Load More
      </button>
    </div>
  );
};

export default Users;
