// We need to parse the string submitted by the user.

function parse () {
  var object_string = document.getElementById('editing').value;
  if (object_string === "") {
    alert("please enter something before submitting");
    return ;
  }

  var type_of_obj = determine_type(object_string);
  if (!type_of_obj) {return;} // safety and sanity check

  // This is an array of types.
  var types     = JSON.parse(localStorage.getItem(type_of_obj));
  var true_num  = types.length + 1 || 1;

  var types_num = determine_num(object_string);
  types_num     = types_num || true_num; // safety and sanity check

  // start storing data
  var obj_arr = types || [], obj = {};
  obj.name = type_of_obj + " " + types_num;

  // check if the name has been used before
  var name_ok = check_name(obj.name, types);
  if (!name_ok) {
    alert("this name has been used before\nPick another one!");
    return;
  }

  obj.num = true_num;
  obj.statement = take_statement(object_string);
  obj.proof = take_proof(object_string);
  obj_arr.push(obj);

  var obj_string_to_store = JSON.stringify(obj_arr);
  // alert(obj_string_to_store);
  localStorage.setItem(type_of_obj, obj_string_to_store);

  // establish some links
  do_links();
}

function determine_type (str) {
  var words = str.split(/\s+/);

  switch (words[0]) {
    case "Lemma":
      return "lemmata";
      break;
    case "Proposition":
      return "propositions";
      break;
    case "Theorem":
      return "theoremata";
      break;
    default:
      alert("Please enter Lemma, Proposition or Theorem as the first word.");
      return null;
      break;
  }
}

function determine_num (str) {
  var words = str.split(/\s+/);
  if (words[1] === "none") {
    return null;
  }

  return words[1];
}

function take_statement (str) {
  var start_index = str.indexOf("begin:");
  if (start_index === -1) {
    alert("enter\nbegin:\nto mark the statement.");
    return null;
  }

  var end_index = str.indexOf("proof:");
  if (end_index === -1) {
    alert("enter\nproof:\nto mark the statement.");
    return null;
  }

  return str.slice(start_index + 6, end_index);
}

function take_proof (str) {
  var start_index = str.indexOf("proof:");
  if (start_index === -1) {
    alert("enter\nproof:\nto mark the statement.");
    return null;
  }

  return str.slice(start_index + 6);
}

function check_name (key, arr) {
  var lookup = [];

  for (var i = 0, len = arr.length; i < len; i++) {
    lookup[arr[i].name] = arr[i];
  }

  if (!lookup[key]) {
    return true;
  } else {
    return false;
  }
}

function do_links () {
  var all_nodes_obj = JSON.parse(localStorage.lemmata).concat(
    JSON.parse(localStorage.propositions),
    JSON.parse(localStorage.theoremata))
  var edges_obj = {};
  var nodes_set = [], edges_set = [];

  for (var i = 0, len = all_nodes_obj.length; i < len; i++) {
    var current_node    = all_nodes_obj[i];
    var current_content = current_node.statement + current_node.proof;
    nodes_set.push({id: i,
                    label: current_node.name,
                    node_type: current_node.name.split(/\s+/)[0]});
    edges_set = add_link(edges_set, current_content, i, all_nodes_obj);
  }

  // var nodes = new vis.DataSet(nodes_set);
  var nodes = JSON.stringify(nodes_set);
  localStorage.setItem("nodes", nodes);

  // var edges = new vis.DataSet(edges_set);
  var edges = JSON.stringify(edges_set);
  localStorage.setItem("edges", edges);
}

function add_link (set, content, the_index, everything) {
  var lookup = [];
  var all_len = everything.length, sep = all_len * all_len;

  for (var i = 0, len = set.length; i < len; i++) {
    lookup[set[i].from * sep + set[i].to] = set[i];
  }

  var start_index = content.indexOf("href{");
  var from_index  = the_index;
  var to_index    = -1;
  while (start_index !== -1) {
    var end_index = content.indexOf("}", start_index + 5); // href+curly
    var nom       = content.slice(start_index + 5, end_index);
    var noms      = nom.split(/\s+/);
    switch (noms[0]) {
      case "Lemma":
        nom = "lemmata " + noms[1];
        break;
      case "Theorem":
        nom = "theoremata " + noms[1];
        break;
      case "Proposition":
        nom = "propositions " + noms[1];
        break;
      default:
        alert(nom+":\nThis type is not accepted");
        return;
        break;
    }
    for (var j = 0, sec_len = everything.length; j < sec_len; j++) {
      var temp = everything[j].name;
      if (temp === nom) {
        to_index = j;
      }
    }
    if (to_index === -1) {
      alert("You are referring to a non-existent node\nPlease review again");
      return;
    }
    if (!lookup[from_index * sep + to_index]) {
      set.push({from: from_index, to: to_index});
    } else {
      alert("Something is wrong; this node is added before");
    }
    content = content.slice(end_index + 1);
    start_index = content.indexOf("href{");
  }
  return set;
}
