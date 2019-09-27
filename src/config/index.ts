export default {
  test: {
    server: {
      port: '60982',
      log: {
        dir: './logs/'
      }
    },
    jwt: {
      secret: '',
      expiresIn: ''
    },
    mongodb: {
      uri: 'localhost',
      port: '27017',
      db: 'myapp'
    }
  },
  stage: {
    server: {
      port: '60983',
      log: {
        dir: './logs/'
      }
    },
    jwt: {
      secret: '',
      expiresIn: ''
    },
    mongodb: {
      uri: 'localhost',
      port: '27017',
      db: 'myapp'
    }
  },
  prod: {
    server: {
      port: '60984',
      log: {
        dir: './logs/'
      }
    },
    jwt: {
      secret: '',
      expiresIn: ''
    },
    mongodb: {
      uri: 'localhost',
      port: '27017',
      db: 'myapp'
    }
  }
};
