
MODEL({
  name: 'Word',
  tableProperties: ['word', 'type', 'definition'],
  properties: [
    'id',
    { name: 'word', tableWidth: 15 },
    { name: 'type', tableWidth: 10 },
    'type', // cmene, cmavo, cmavo-compound, fu'ivla, gismu, lujvo
    {
      model_: 'ArrayProperty',
      name: 'rafsi',
      factory: function() { return []; }
    },
    'selmaho'
    'definition',
    'notes',
    {
      model_: 'BooleanProperty',
      name: 'unofficial',
      defaultValue: false
    }
  ]
});

/*
<valsi word="Indias" type="cmene"><definition>India.</definition>
<definitionid>17712</definitionid><notes>Cf. {xingu&apos;e}.</notes></valsi>
*/
