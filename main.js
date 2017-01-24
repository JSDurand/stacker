// Just a simple example.

function show_graph (nodes, edges) {
  var container = document.getElementById('mynetwork');
  var true_nodes = new vis.DataSet(nodes);
  var true_edges = new vis.DataSet(edges);
  var data = {
    nodes: true_nodes,
    edges: true_edges
  };
  var options = {interaction: {hover: true}};
  var network = new vis.Network(container, data, options);
  network.on('hoverNode', function(properties) {
    var ids = properties.node;
    var clicked_label = true_nodes.get(ids).label;
    var clicked_type = clicked_label.split(/\s+/)[0];
    var complete_nodes = JSON.parse(localStorage.getItem(clicked_type));
    var len = complete_nodes.length;
    var statement, proof;
    for (var i = 0; i < len; i++) {
      if (complete_nodes[i].name === clicked_label) {
        statement = complete_nodes[i].statement;
        proof = complete_nodes[i].proof;
        break;
      }
    }
    var informater = document.getElementById('information');
    statement = statement.replace('\n', '<br>');
    proof = proof.replace('\n', '<br>');
    informater.innerHTML = statement + '<br>' + proof;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'information']); 
  });
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

// function find_node (nodes_set, label) {
  // We assume nodes_set is an array of objects
  // for
// }
