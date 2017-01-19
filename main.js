// Just a simple example.

var nodes = new vis.DataSet([
    {id: 1, label: 'child of first child'},
    {id: 2, label: 'first child'},
    {id: 3, label: 'root'},
    {id: 4, label: 'second child'},
    {id: 5, label: 'child of second child'}
]);
// create an array with edges
var edges = new vis.DataSet([
  {from: 3, to: 2},
  {from: 3, to: 4},
  {from: 2, to: 1},
  {from: 4, to: 5},
]);
// create a network
var container = document.getElementById('mynetwork');
var data = {
  nodes: nodes,
  edges: edges
};
var options = {};
var network = new vis.Network(container, data, options);
