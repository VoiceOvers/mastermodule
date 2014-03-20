// var app = require('../app');

// exports.impl = {};
// exports.impl.putOne = function *(id, data) {
//   var user = yield app.models.User.findByIdAndUpdate(id, data).exec();
//   return user;
// };

// // /api/users
// exports.deleteOne = function *(next) {
//   try {
//     yield app.models.app.models.User.findByIdAndRemove(this.params.id).exec();
//     this.status = 200;
//   } catch (e) {
//     this.throw(500, e);
//   }
//   yield next;
// };

// exports.getAll = function *(next) {
//   this.body = yield app.models.User.find({}).exec();
//   yield next;
// };

// exports.getOne = function *(next) {
//   var user;
//   try {
//     user = yield app.models.User.findById(this.params.id)
//       .select('name email roles stripe access accessToken')
//       .lean()
//       .exec();
//     this.body = user;
//     this.status = 200;
//   } catch (e) {
//     this.throw(500, e);
//   }
//   yield next;
// };

// exports.putOne = function *(next) {
//   try {
//     this.body = yield exports.impl.putOne(this.params.id, this.req.body);
//     this.status = 200;
//   } catch (e) {
//     this.throw(500, {errors: [ e ]});
//   }
//   yield next;
// };