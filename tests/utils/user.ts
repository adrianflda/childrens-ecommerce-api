export const TEST_USER_1 = {
  username: 'testuser1',
  password: 'myPassword'
};

export const TEST_USER_2_ADMIN = {
  username: 'testadminuser2',
  password: 'myPassword',
  roles: ['user', 'admin']
};

export const TEST_USER_3_USER = {
  username: 'testuser3',
  password: 'myPassword'
};

export const TEST_USER_4_ADMIN = {
  username: 'testadminuser4',
  password: 'myPassword',
  roles: ['user', 'admin']
};

export const users = [
  {
    id: 1,
    username: 'user1',
    displayName: 'John Doe',
    profile: {
      age: 30,
      gender: 'male',
      address: '123 Main Street, Anytown, USA'
    },
    deleted: false,
    token: 'abc123',
    roles: ['user', 'admin']
  },
  {
    id: 2,
    username: 'user2',
    displayName: 'Jane Doe',
    profile: {
      age: 25,
      gender: 'female',
      address: '456 Elm Street, Anytown, USA'
    },
    deleted: false,
    token: 'def456',
    roles: ['user']
  },
  {
    id: 3,
    username: 'user3',
    displayName: 'Peter Smith',
    profile: {
      age: 40,
      gender: 'male',
      address: '789 Oak Street, Anytown, USA'
    },
    deleted: false,
    token: 'ghi789',
    roles: ['user']
  },
  {
    id: 4,
    username: 'user4',
    displayName: 'Mary Jones',
    profile: {
      age: 20,
      gender: 'female',
      address: '101 Broadway, Anytown, USA'
    },
    deleted: false,
    token: 'jkl123',
    roles: ['user']
  },
  {
    id: 5,
    username: 'user5',
    displayName: 'David Brown',
    profile: {
      age: 35,
      gender: 'male',
      address: '202 Main Street, Anytown, USA'
    },
    deleted: false,
    token: 'mno567',
    roles: ['user']
  }
];
