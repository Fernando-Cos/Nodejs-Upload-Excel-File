module.exports = (sequelize, Sequelize) => {
	const Customer = sequelize.define('customer', {	
	name: {
      type: Sequelize.STRING
    },
    parts_no: {
      type: Sequelize.STRING
    },

    unt_usg: {
      type: Sequelize.STRING
    },

    description: {
      type: Sequelize.STRING
    },

    ref_designator: {
      type: Sequelize.STRING
    },
	});
	
	return Customer;
}