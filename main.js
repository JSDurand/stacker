// The main file

function show_graph (nodes, edges) {
  var container = document.getElementById('mynetwork');
  var true_nodes = new vis.DataSet(nodes);
  var true_edges = new vis.DataSet(edges);
  var data = {
    nodes: true_nodes,
    edges: true_edges
  };
  var options = {interaction: {hover: true}, edges: {
    arrows: 'to',
    physics: true
  }};
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

    // statement part
    statement = statement.replace(/\n/g, '<br>'); // replace the new line
    statement = statement.replace(/\\href{(.*?)}/g, "<a target=\"_blank\" href=\"?$1#content-anchor\" class=\"underline\">$1</a>");
    // replace enumerate things
    statement = statement.replace(/\\begin{enumerate}\s*?\\item/g, "<ol><li>");
    statement = statement.replace(/\\item/g, "</li><li>");
    statement = statement.replace(/\\end{enumerate}/g, "</li></ol>");

    // proof part
    proof = proof.replace(/\n/g, '<br>');
    proof = proof.replace(/\\href{(.*?)}/g, "<a target=\"_blank\" href=\"?$1#content-anchor\" class=\"underline\">$1</a>");

    // replace enumerate things
    proof = proof.replace(/\\begin{enumerate}\s*?\\item/g, "<ol><li>");
    proof = proof.replace(/\\item/g, "</li><li>");
    proof = proof.replace(/\\end{enumerate}/g, "</li></ol>");

    // title and label
    // label is the first word after title; maybe this should be
    // refined later.
    var true_title, true_label = clicked_label.split(/\s+/)[1];
    switch (clicked_type) {
      case 'lemmata':
        true_title = 'Lemma ';
        break;
      case 'propositions':
        true_title = 'Proposition ';
        break;
      case 'theoremata':
        true_title = 'Theorem ';
        break;
      default:
        true_title = 'Not available';
        break;
    }
    informater.innerHTML = true_title + true_label + ':<br>' + statement + '<br><br>Proof:<br>' + proof;
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'information']); 
    network.body.emitter.emit('_dataChanged');
    network.redraw();
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
  var sure = prompt('Are you sure you  want to clear all the data?\nEnter y or n.');

  if (sure === 'n') { return; }

  localStorage.setItem("lemmata", "[]");
  localStorage.setItem("propositions", "[]");
  localStorage.setItem("theoremata", "[]");
  localStorage.setItem("nodes", "[]");
  localStorage.setItem("edges", "[]");
}

function show_dep () {
  var nodes_str = localStorage.getItem("nodes");
  if (nodes_str === "" || !nodes_str) {
    alert("no nodes yet!");
    return;
  }
  var nodes     = JSON.parse(nodes_str);

  var edges_str = localStorage.getItem("edges");
  if (edges_str === "" || !edges_str) {
    alert("no edges yet!");
    return;
  }
  var edges     = JSON.parse(edges_str);

  show_graph(nodes, edges);

}

function show_all () {
  alert("NOT IMPLEMENTED YET!");
}

function show_lem (lem_str) {
  var type_of_lem = determine_type(lem_str);
  var types_array = JSON.parse(localStorage.getItem(type_of_lem));
  var types_len   = types_array.length;
  var true_label  = "";
  var true_statement = null, true_proof = null;

  if (types_len === 0) {
    alert('no nodes to show\nQuite weird.');
    return;
  }

  switch (type_of_lem) {
    case 'lemmata':
      true_label = 'Lemma ' + lem_str.split(/\s+/)[1];
      break;
    case 'theoremata':
      true_label = 'Theorem ' + lem_str.split(/\s+/)[1];
      break;
    case 'propositions':
      true_label = 'Proposition ' + lem_str.split(/\s+/)[1];
      break;
    default:
      alert('You can only refer to lemmas, propositions, or theorems');
      return;
      break;
  }

  for (var i = 0; i < types_len; i++) {
    if (types_array[i].name === type_of_lem + ' ' + lem_str.split(/\s+/)[1]) {
      var type_i = types_array[i];
      true_statement = type_i.statement;
      true_proof = type_i.proof;
    }
  }

  if (!true_statement) {
    alert('I cannot find a node with referenced name, sorry');
    alert(lem_str+types_array[0].name);
    return;
  }

  // insert into HTML
  true_statement = true_statement.replace(/\n/g, '<br>'); // replace the new line
  true_statement = true_statement.replace(/\\href{(.*?)}/g, "<a target=\"_blank\" href=\"?$1#content-anchor\" class=\"underline\">$1</a>");
  // replace enumerate things
  true_statement = true_statement.replace(/\\begin{enumerate}\s*?\\item/g, "<ol><li>");
  true_statement = true_statement.replace(/\\item/g, "</li><li>");
  true_statement = true_statement.replace(/\\end{enumerate}/g, "</li></ol>");

  true_proof = true_proof.replace(/\n/g, '<br>');
  true_proof = true_proof.replace(/\\href{(.*?)}/g, "<a target=\"_blank\" href=\"?$1#content-anchor\" class=\"underline\">$1</a>");

  // replace enumerate things
  true_proof = true_proof.replace(/\\begin{enumerate}\s*?\\item/g, "<ol><li>");
  true_proof = true_proof.replace(/\\item/g, "</li><li>");
  true_proof = true_proof.replace(/\\end{enumerate}/g, "</li></ol>");

  var container = document.getElementById('node-content');
  container.innerHTML = "<strong>" + true_label + ':</strong><br>' + true_statement
    + '<br><br><strong>Proof:</strong><br>' + true_proof;
}

// This function executes when the page loads and exhibits the desired node
function show_on_load () {
  // The query string in URL
  var query_string = window.location.search.substring(1);
  // default parametres
  var lemma_str = "";
  if (query_string === "") {
    return; // Nothing to show
  } else {
    // where the lemma parameter starts
    lemma_str   = decodeURIComponent(query_string);
  }

  if (lemma_str === "") {
    alert("syntax error: there should be a query string.");
    return;
  }

  show_lem(lemma_str);

  // add home URL
  var home = window.location.href.split(/[?#]/)[0];
  document.getElementById('home-link').href = home;
}

window.onload = show_on_load;

// show an independent lemma
function show_independent () {
  var url = window.location.href;
  var append = document.getElementById("information").innerHTML.split(/:<br>/)[0];
  append = append.replace(/ /g, '%20');
  if (append === '') {
    alert('Nothing to show');
    return;
  }

  var question_index = url.indexOf('?'); // index of question
   if (question_index !== -1) { // if query string
     url = url.split(/\?/)[0];
   }

  var anchor_index   = url.indexOf('#'); // index of anchor
   if (anchor_index !== -1) { // if anchor string
     url = url.split(/#/)[0];
   }

  url = url + '?' + append + '#content-anchor';

  var win = window.open(url, '_blank');
  win.focus();
}

// transform function
function transform_to_inner (str) {
  var first_word = str.split(/\s+/)[0], title;
  switch (first_word) {
    case "Lemma":
      title = "lemmata";
      break;
    case "Proposition":
      title = "propositions";
      break;
    case "Theorem":
      title = "theoremata";
      break;
    default:
      title = "not available";
      alert(title);
      break;
  }

  return title + ' ' + str.split(/\s+/)[1];
}

// refine or edit the node
function refine () {
  var title = document.getElementById('node-content').innerText.split(/:\n/)[0];
  var complete_name_of_obj = transform_to_inner(title);
  var type_of_obj = complete_name_of_obj.split(/\s+/)[0];

  var types = JSON.parse(localStorage.getItem(type_of_obj));
  var len = types.length, obj = {};

  for (var i = 0; i < len; i++) {
    if (types[i].name === complete_name_of_obj) {
      var find      = types[i];
      obj.statement = find.statement;
      obj.proof     = find.proof;
    }
  }

  document.getElementById('editing').value =
    title + '\nbegin:' + obj.statement + '\nproof:' + obj.proof;
  document.getElementById('edit-area').style.display = 'block';
}
