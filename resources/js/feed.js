const { database } =  require("../helpers/database");
const { DB } = require("../helpers/dbi");


async function updateFeed() {
    console.log("updating feed");
	var [error, results] = await DB.query(`UPDATE AlgorithmComponents SET valid = false;`);    
    if (error) {    
        console.error('Error updating valid before recalculating feed: ' + error);
    }
    var [error, results] = await DB.query(`INSERT INTO AlgorithmComponents 
    (user_id, post_id, post_reaction, post_group, post_time)
    SELECT * FROM AlgorithmComponentsView;`);      
    if (error) {    
        console.error('Error inserting new algorithm components: ' + error);
    }
    var [error, results] = await DB.query(`DELETE FROM AlgorithmComponents WHERE valid = false;`);    
    if (error) {    
        console.error('Error removing old rows of AlgorithmComponents: ' + error);
    }
}


module.exports = {updateFeed};