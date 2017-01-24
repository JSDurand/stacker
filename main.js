// Just a simple example.

function show_graph (nodes, edges) {
  var container = document.getElementById('mynetwork');
  var true_nodes = new vis.DataSet(nodes);
  var true_edges = new vis.DataSet(edges);
  var data = {
    nodes: true_nodes,
    edges: true_edges
  };
  var options = {};
  var network = new vis.Network(container, data, options);
}

function add_lemma () {
  document.getElementById("edit-area").style.display = 'block';
  var nodes_str = localStorage.getItem("nodes");
  if (!nodes_str) {
    localStorage.setItem("nodes", "");
  }

  var edges_str = localStorage.getItem("edges");
  if (!edges_str) {
    localStorage.setItem("edges", "");
  }

  var lemmata_str = localStorage.getItem("lemmata");
  if (!lemmata_str) {
    localStorage.setItem("lemmata", "[]");
  }

  var propositions_str = localStorage.getItem("propositions");
  if (!propositions_str) {
    localStorage.setItem("propositions", "[]");
  }

  var theoremata_str = localStorage.getItem("theoremata");
  if (!theoremata_str) {
    localStorage.setItem("theoremata", "[]");
  }
}

function clear_lemma () {
  localStorage.setItem("lemmata", "[]");
  localStorage.setItem("propositions", "[]");
  localStorage.setItem("theoremata", "[]");
  localStorage.setItem("nodes", "[]");
  localStorage.setItem("edges", "[]");
}

function show_dep () {
  var nodes_str = localStorage.getItem("nodes");
  if (nodes_str === "") {
    alert("no nodes yet!");
    return;
  }
  var nodes     = JSON.parse(nodes_str);

  var edges_str = localStorage.getItem("edges");
  if (edges_str === "") {
    alert("no edges yet!");
    return;
  }
  var edges     = JSON.parse(edges_str);

  show_graph(nodes, edges);

}

function show_all () {
  alert("NOT IMPLEMENTED YET!");
}
