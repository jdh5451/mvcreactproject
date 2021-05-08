const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getTitles', mid.requiresLogin, controllers.List.getTitles);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/app', mid.requiresLogin, controllers.List.listPage);
  app.post('/edit', mid.requiresLogin, controllers.List.editList);
  app.post('/update', mid.requiresLogin, controllers.List.updateList);
  app.post('/app', mid.requiresLogin, controllers.List.makeList);
  app.get('/isPremium', mid.requiresLogin, controllers.Account.getPremium);
  app.post('/goPremium', mid.requiresLogin, controllers.Account.goPremium);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
