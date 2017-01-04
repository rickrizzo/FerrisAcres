const db = require('../controllers/db.js');
const fs = require('fs');

module.exports = {
  getAllEnums: function() {
    db.getConnection().task(function * (t) {
      // Variables
      var dbEnums = {
        cake_types:[],
        cake_sizes:{},
        colors:[],
        ice_cream_sizes:[],
        ice_cream_flavors:[],
        fillings:[]
      };

      // Create File
      if(!fs.existsSync('enum')) {
        fs.mkdirSync('enum');
      }

      // Cake Type Enums
      const select_all_cake_types = 'SELECT enum_range(NULL::CAKE_TYPE);';
      let cake_types = yield t.any(select_all_cake_types);
      cake_types[0].enum_range.replace(/[{}]/g, "").split(',').forEach(type => {
        dbEnums.cake_types.push({"name":type});
      });

      const select_all_cake_size_prices = 'SELECT * FROM cake_size_prices;';
      let cake_sizes = yield t.any(select_all_cake_size_prices, ['Heart']);
      cake_sizes.forEach(row => {
        if(!(row.size in dbEnums.cake_sizes)) {
          dbEnums.cake_sizes[row.size] = {'display_name':row.size.replace('_', '" '), 'pricing':[]};
        }
        dbEnums.cake_sizes[row.size].pricing.push({'type':row.type, 'price':row.price});
      });

      // Color Enum
      const select_all_colors = 'SELECT enum_range(NULL::COLOR);';
      let colors = yield t.any(select_all_colors);
      colors[0].enum_range.replace(/[{}]/g, "").split(',').forEach(color => {
        dbEnums.colors.push({name:color.replace(/['"]+/g, '')})
      });

      // Ice Cream Size Enum
      const select_all_ice_cream_size_prices = 'SELECT * FROM ice_cream_size_prices;';
      let ice_cream_sizes = yield t.any(select_all_ice_cream_size_prices);
      ice_cream_sizes.forEach(row => {
        dbEnums.ice_cream_sizes.push({"name":row.size, "price":row.price});
      });

      // Ice Cream Flavor Enum
      const select_all_ice_cream_flavors = 'SELECT enum_range(NULL::ICE_CREAM_FLAVOR);';
      let ice_flavors = yield t.any(select_all_ice_cream_flavors);
      ice_flavors[0].enum_range.replace(/[{}]/g, "").split(',').forEach(flavor => {
        dbEnums.ice_cream_flavors.push({"name":flavor.replace(/['"]+/g, '')});
      });

      // Fillings Enum
      const select_all_filling_prices = 'SELECT * FROM filling_prices;';
      let fillings = yield t.any(select_all_filling_prices);
      fillings.forEach(row => {
        dbEnums.fillings.push({"name":row.filling.replace(/['"]+/g, ''), "price":row.price});
      });

      // Write File
      fs.writeFile('enum/enums.json', JSON.stringify(dbEnums), (err) => {
        if (err) {
          console.log("ERROR WRITING:", err);
        }
      });
    })
    .catch(error => {
      return error;
    })
  }
}
