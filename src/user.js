const { getUserByID } = require('./mockData/users');

function configureUser(app) {
  app.post('/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(req.user);
    } else {
      res.status(401).send();
    };
  });

  app.post('/editProfile', (req, res) => {
    if (req.isAuthenticated()) {
      const loggedUser = getUserByID(req.user.id);
      if (loggedUser) {
        const updatedUserFields = req.body;
        Object.keys(updatedUserFields).forEach(fieldName => {
          console.log('upd field', fieldName)
          loggedUser[fieldName] = updatedUserFields[fieldName];
        });
        res.status(200).send(loggedUser);
      } else {
        res.status(404).send('User is not found.');
      }
    } else {
      res.status(401).send('User is not authorized.');
    }
  });
}

module.exports = configureUser;
