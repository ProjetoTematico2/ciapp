const { Model, DataTypes } = require('sequelize');
const Database = require("../config/database");

class Entidade extends Model {
  static associate(models) {
  }
}
Entidade.init({
  nome:
  {
    allowNull: false,
    type: DataTypes.STRING
  },

  cnpj:
  {
    allowNull: false,
    type: DataTypes.STRING
  },

  email:
  {
    allowNull: true,
    type: DataTypes.STRING
  },
  telefone1:
  {
    allowNull: false,
    type: DataTypes.STRING
  },
  telefone2: {
    allowNull: true,
    type: DataTypes.STRING
  },
  data_entrega: {
    allowNull: true,
    type: DataTypes.DATE
  },
  tipo_instituicao:
  {
    allowNull: false,
    type: DataTypes.INTEGER
  },

  dt_descredenciamento:
  {
    allowNull: true,
    type: DataTypes.DATE
  },
  observacao:
  {
    allowNull: true,
    type: DataTypes.TEXT
  },
  ref_integracao:
  {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
  },
  somente_leitura: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
  }

}, {
  sequelize: Database.sequelize,
  modelName: 'Entidade'
});

module.exports = Entidade;

