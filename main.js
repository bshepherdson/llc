var blessed = require('blessed');
require('./foam/core/bootFOAMnode');
require('./foam/core/experimental/cli');
require('./models');

var screen = blessed.screen();

screen.key(['escape', 'C-c'], function(ch, key) {
  return process.exit(0);
});

MODEL({
  name: 'TableRowCLIView',
  properties: [
    'data'
  ],
  methods: {
    out: function() {
      // Returns a string with this row's data's tableProperties
      // rendered into a list.
      var props = this.data.model_.tableProperties;
      var out = [];
      for (var i = 0 ; i < props.length ; i++ ) {
        var p = props[i];
        var v = this.data[p];
        if ( ! p.tableWidth ) {
          out.push(v);
        } else if ( v.length > p.tableWidth ) {
          out.push((''+v).substring(0, p.tableWidth));
        } else {
          out.push(''+v);
          if ( v.length < p.tableWidth )
            out.push('                      '.substring(0, p.tableWidth - v.length);
        }
      }
      return out.join('');
    }
  }
});

MODEL({
  name: 'TableCLIView',
  properties: [
    {
      model_: 'DAOProperty',
      name: 'dao',
      onDAOUpdate: 'onDAOUpdate'
    },
    'list'
  ],
  methods: {
    init: function() {
      this.SUPER();
      this.list = blessed.list({
        style: {
          selected: {
            fg: 'white',
            bg: 'blue',
            bold: true
          },
          item: {
            fg: 'white',
            bg: 'black'
          },
          keys: true
        }
      });

      this.onDAOUpdate();
    },
    attach: function(parent) {
      parent.append(this.list);
    }
  },

  listeners: [
    {
      name: 'onDAOUpdate',
      code: function() {
        if ( ! this.dao ) return;
        this.dao.select([])(function(a) {
          this.list.setItems(a.map(function(x) {
            return TableRowCLIView.create({ data: x }).out();
          }));
          this.list.select(0);
          this.list.render();
        }.bind(this));
      }
    }
  ]
});

MODEL({
  name: 'DictController',
  properties: [
    {
      name: 'dao',
      factory: function() {
        return LojbanDAO.create({
          name: 'jbovlaste.xml'
        });
      }
    },
    {
      name: 'filteredDAO',
      model_: 'DAOProperty',
      dynamicValue: function() {
        return this.dao.where(
          CONTAINS_IC(SEQ(
            Word.WORD,
            Word.DEFINITION,
            Word.NOTES
          ), this.search)
        );
      }
    },
    'search'
  ],

  methods: {
    init: function() {
      this.SUPER();

      var form = blessed.form();
      form.on('submit', function(data) {
        this.search = data;
      }.bind(this));

      var input = blessed.input({
        width: 20
      });
      form.append(input);
      screen.append(form);
      form.focus();

      var table = TableCLIView.create({
        dao$: this.filteredDAO$
      });
      table.attach(screen);
    }
  }
});





box.focus();
screen.render();

