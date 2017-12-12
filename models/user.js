const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  facebookId: { type: String },
  facebookPhotos: { type: String }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual('password')
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

UserSchema.statics.findOrCreate = async function(query, username) {
  try {
    let user = await User.findOne(query);
    if (!user) {
      user = new User(query);
      user.username = username;
      await user.save();
    }
    return user;
  } catch (e) {
    console.log(e);
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
