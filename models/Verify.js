var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SFVerifySchema = new Schema({
  user_id: {type: String, required: "ユーザIDは必須"},
  access_token: {type: String, required: "トークンは必須"},
  signature: {type: String, required: "シグネチャは必須"},
  organization_id: {type: String, required: "IDは必須"},
  instance_url: {type: String, required: "URLは必須"},
  created: {type: Date, default: Date.now},
  modified: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Verify", SFVerifySchema);