const jws = require('jws');

const signature = jws.sign({
  header: { typ: 'JW', alg: 'HS256' },
  payload: '{iss: "fcc",user_id: "123456"}',
  secret: 'dengcc'
});

const valid = jws.verify(signature, 'HS256', 'dengcc');
console.log(signature);
console.log(valid);
console.log(jws.decode(signature));
