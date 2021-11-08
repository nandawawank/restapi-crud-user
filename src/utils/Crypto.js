const crypto = require("crypto");

class Crypto {
  constructor() {
    this.algorithm = "aes-256-cbc";
    this.algo_key = "b7e578f5a44c544a74036e1c1385e2d9";
    this.algo_iv = "b6df7372efa41b9f";

    this.encrypt = this.encrypt.bind(this);
    this.decrypt = this.decrypt.bind(this);
  }

  async encrypt(text) {
    const cipher = crypto.createCipheriv(this.algorithm,
        Buffer.from(this.algo_key), this.algo_iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {iv: this.algo_iv.toString("hex"),
      encryptedData: encrypted.toString("hex")};
  }

  async decrypt(password) {
    const encryptedText = Buffer.from(password, "hex");
    const decipher = crypto.createDecipheriv(this.algorithm,
        Buffer.from(this.algo_key), this.algo_iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

module.exports = Crypto;
