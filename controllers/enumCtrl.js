const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/ferris_acres');
const fs = require('fs');

const select_all_cake_types = 'SELECT enum_range(NULL::CAKE_TYPE);';
const select_all_cake_sizes = 'SELECT enum_range(NULL::CAKE_SIZE);';
const select_all_colors = 'SELECT enum_range(NULL::COLOR);';
const select_all_ice_cream_sizes = 'SELECT enum_range(NULL::ICE_CREAM_SIZE);';
const select_all_ice_cream_flavors = 'SELECT enum_range(NULL::ICE_CREAM_FLAVOR);';

module.exports = {
  getCakeTypes: function() {
    db.any(select_all_cake_types)
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      return error;
    })
  },
  getCakeSizes: function(req, res, next) {
    db.any(select_all_cake_sizes)
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      return next(error);
    })
  },
  getCakeColors: function(req, res, next) {
    db.any(select_all_colors)
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      return next(error);
    })
  },
  getAllEnums: function() {
    db.task(function * (t) {
      // Variables
      var cakeEnums = {
        cake_types:[],
        cake_sizes:[],
        colors:[],
        ice_cream_sizes:[],
        ice_cream_flavors:[]
      };

      // Create File
      if(!fs.existsSync('enum')) {
        fs.mkdirSync('enum');
      }

      // Cake Type Enums
      let cake_types = yield t.any(select_all_cake_types);
      cake_types[0].enum_range.replace(/[{}]/g, "").split(',').forEach(type => {
        cakeEnums.cake_types.push({"name":type});
      });

      // Cake Size Enum
      let cake_sizes = yield t.any(select_all_cake_sizes);
      cake_sizes[0].enum_range.replace(/[{}]/g, "").split(',').forEach(size => {
        cakeEnums.cake_sizes.push({"name":size, "display_name":size.replace('_', '" ')});
      });

      // Color Enum
      let colors = yield t.any(select_all_colors);
      colors[0].enum_range.replace(/[{}]/g, "").split(',').forEach(color => {
        cakeEnums.colors.push({"name":color.replace(/['"]+/g, '')})
      });

      // Ice Cream Size Enum
      let ice_sizes = yield t.any(select_all_ice_cream_sizes);
      ice_sizes[0].enum_range.replace(/[{}]/g, "").split(',').forEach(size => {
        cakeEnums.ice_cream_sizes.push({"name":size});
      });

      // Ice Cream Flavor Enum
      let ice_flavors = yield t.any(select_all_ice_cream_flavors);
      ice_flavors[0].enum_range.replace(/[{}]/g, "").split(',').forEach(flavor => {
        cakeEnums.ice_cream_flavors.push({"name":flavor.replace(/['"]+/g, '')});
      });

      // Write File
      fs.writeFile('enum/enums.json', JSON.stringify(cakeEnums), (err) => {
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
