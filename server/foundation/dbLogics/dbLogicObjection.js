const { Model } = require('objection')
const Knex = require('knex')

const knex = Knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'password',
    database : 'codeforthefences'
  }
})

Model.knex(knex)

class foodType extends Model {
  static get tableName() { return 'foodType'; }
}

class foodVariant extends Model {
  static get tableName() { return 'foodVariant'; }
}

class food extends Model {
  static get tableName() { return 'food'; }

  static get relationMappings() {
    return {
      "foodType": {
        relation: Model.HasOneRelation,
        modelClass: foodType,
        join: {
          from: 'food.foodTypeId',
          to: 'foodType.id'
        }
      },
      foodVariant: {
        relation: Model.HasOneRelation,
        modelClass: foodVariant,
        join: {
          from: 'food.foodVariantId',
          to: 'foodVariant.id'
        }
      }
    }
  }
}

// class prepStyle extends Model {
//   static get tableName() { return 'prepStyle'; }
// }
//
// class preppedFood extends Model {
//   static get tableName() { return 'preppedFood'; }
//
//   static get relationMappings() {
//     return {
//       prepStyle: {
//         relation: Model.ManyToManyRelation,
//         modelClass: foodType,
//         join: {
//           from: 'foodVariant.id',
//           through: {
//             from: 'food.foodVariantId',
//             to: 'food.foodTypeId'
//           },
//           to: 'foodType.id'
//         }
//       }
//     }
//   }
// }

module.exports = async () => {
  return await food.query().select('foodVariant.*', 'foodType.*').joinRelated('foodVariant', { alias: 'foodVariant' }).where('foodVariant.name', "blackened").joinRelated("foodType", { alias: 'foodType' })
  //return await food.query().withGraphFetched('[foodType, foodVariant]').where('name', "butter")
}

// class food extends Model {
//   static get relationMappings() {
//     return {
//
//     }
//   }
// }

// CREATE TABLE foodType (
//   `id` int AUTO_INCREMENT primary key NOT NULL,
//   `name` nvarchar(32) NOT NULL,
//   `plural` nvarchar(32) NULL,
//   `abbreviation` nvarchar(16) NULL,
//   `plAbbrev` nvarchar(16) NULL
// );
//
// CREATE TABLE foodVariant (
//   `id` int AUTO_INCREMENT primary key NOT NULL,
//   `name` nvarchar(32) NOT NULL,
//   `abbreviation` nvarchar(32) NOT NULL,
//   `description` nvarchar(64) NOT NULL
// );
//
// CREATE TABLE food (
//   `id` int AUTO_INCREMENT primary key NOT NULL,
//   `foodTypeId` int NOT NULL,
//   `foodVariantId` int NULL
// );
