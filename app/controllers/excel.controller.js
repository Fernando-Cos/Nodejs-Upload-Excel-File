var stream = require('stream');
var await = require('await')

const db = require('../config/db.config.js');
const Customer = db.Customer;

const excel = require('exceljs');

const readXlsxFile = require('read-excel-file/node');

exports.uploadFile = (req, res) => {
    try{
        let filePath = __basedir + "/uploads/" + req.file.filename;

        readXlsxFile(filePath).then(rows => {
            // `rows` is an array of rows
            // each row being an array of cells.   
            console.log(rows);
    
            // Remove Header ROW
            rows.shift();
            
            const customers = [];
    
            let length = rows.length;
    
            for(let i=0; i<length; i++){
    
                let customer = {
                      name: rows[i][0],
                      parts_no: rows[i][1],
                      unt_usg: rows[i][2],
                      description: rows[i][3],
                      ref_designator: rows[i][4],
                }
    
                customers.push(customer);
            }
    
            Customer.bulkCreate(customers).then(() => {
                const result = {
                    status: "ok",
                    filename: req.file.originalname,
                    message: "Upload com sucesso!!!",
                }

                res.json(result);
            });
        });
    }catch(error){
        const result = {
            status: "fail",
            filename: req.file.originalname,
            message: "Error Upload! Menssagem = " + error.message
        }
        res.json(result);
    }
}

/** 
 * Upload multiple Excel Files
 *  
 * @param {*} req 
 * @param {*} res 
 */
exports.uploadMultipleFiles = async (req, res) => {
	const messages = [];

	for (const file of req.files) {
        try{
            let filePath = __basedir + "/uploads/" + file.filename;
            let rows = await readXlsxFile(filePath);
    
            // `rows` is an array of rows
            // each row being an array of cells.   
            console.log(rows);
    
            // Remove Header ROW
            rows.shift();
            
            const customers = [];
    
            let length = rows.length;
    
            for(let i=0; i<length; i++){
    
                let customer = {
                    id: rows[i][0],
                    name: rows[i][1],
                    address: rows[i][2],
                    age: rows[i][3]
                }
    
                customers.push(customer);
            }
    
            uploadResult = await Customer.bulkCreate(customers);
    
            // It will now wait for above Promise to be fulfilled and show the proper details
            console.log(uploadResult);
    
            if (!uploadResult){
                const result = {
                    status: "fail",
                    filename: file.originalname,				
                    message: "Não é possível carregar com sucesso!",
                }
    
                messages.push(result);
            } else {
                const result = {
                    status: "ok",
                    filename: file.originalname,
                    message: "Carregado com Sucesso!",
                }
                messages.push(result);
            }                   
        }catch(error){
            const result = {
                status: "fail",
                filename: file.originalname,				
                message: "Error -> " + error.message
            }

            messages.push(result);
        }
	}

	return res.json(messages);
}

exports.downloadFile = (req, res) => {
    Customer.findAll().then(objects => {
        var customers = [];
        let length = objects.length;

        for(let i=0; i<length; i++){
            let datavalues = objects[i].dataValues;
            let customer = {
                name: datavalues.name,
                parts_no: datavalues.parts_no,
                unt_usg: datavalues.unt_usg,
                description: datavalues.description,
                ref_designator: datavalues.ref_designator,
                createdAt: datavalues.createdAt,
                updatedAt: datavalues.updatedAt,
            } ;
            customers.push(customer);
        }

		console.log(customers);

        const jsonCustomers = JSON.parse(JSON.stringify(customers));

        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet('Customers'); //creating worksheet

        worksheet.columns = [
          { header: "Name", key: "name", width: 16 },
          { header: "Parts_no", key: "parts_no", width: 15 },
          { header: "Unt_usg", key: "unt_usg", width: 23 },
          { header: "Description", key: "description", width: 53 },
          { header: "Ref_designator", key: "ref_designator", width: 25 },
          { header: "CreatedAt", key: "createdAt", width: 12 },
          { header: "UpdatedAt", key: "updatedAt", width: 31 },
        
        ]; 
        // Add Array Rows
        worksheet.addRows(jsonCustomers);
    
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'customer.xlsx');

        return workbook.xlsx.write(res)
                .then(function() {
                    res.status(200).end();
                });
    });
}

exports.search = (req, res) => {
    Customer.findAll().then(objects => {
        var customers = [];
        let length = objects.length;

        for(let i=0; i<length; i++){
            let datavalues = objects[i].dataValues;
            let customer = {
                name: datavalues.name,
                parts_no: datavalues.parts_no,
                unt_usg: datavalues.unt_usg,
                description: datavalues.description,
                ref_designator: datavalues.ref_designator,
                createdAt: datavalues.createdAt,
                updatedAt: datavalues.updatedAt,
            } ;
            customers.push(customer);
        }

        // console.log(customers);

        const jsonCustomers = JSON.parse(JSON.stringify(customers));
        console.log(customers);
    });
};