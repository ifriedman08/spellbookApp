window.dndSpellbook = (function () {

  var getKnownSpellsFromLs = function () {
    return typeof window.localStorage.knownSpells === 'undefined' ? [] : window.localStorage.knownSpells.split('|');
  };

  var state = {
    knownSpells: getKnownSpellsFromLs(),
    searchParam: '',
    mainAppDiv: $(`#app-main`),
    promises: {
      spellIndex: $.getJSON('http://www.dnd5eapi.co/api/spells'),
      navBarTemplate: $.get('components/nav-bar.hbs'),
      spellListTemplate: $.get('components/spell-list.hbs'),
      spellModalTemplate: $.get('components/spell-modal.hbs'),
      clearButtonTemplate: $.get('components/clear-list-button.hbs')
    },
    containers: {
      appNav: $(`#app-nav`),
      appContent: $(`#app-content`)
    }
  };

  var saveKnownSpellsToLs = function () {
    localStorage.knownSpells = state.knownSpells.join('|');
  }

  var addToKnownSpells = function (spellId) {
    state.knownSpells.push(spellId.toString());
    saveKnownSpellsToLs();
  };

  var removeFromKnownSpells = function (spellId) {
    state.knownSpells.splice(state.knownSpells.indexOf(spellId.toString()), 1);
    saveKnownSpellsToLs();
  };

  var renderNavBar = function () {
    $.when(state.promises.navBarTemplate).done(function (data) {
      state.containers.appNav.append(data);
    })
  };

  var renderSpellIndex = function () {
    $.when(state.promises.spellListTemplate, state.promises.spellIndex).done(function (spellListTemplate, spellIndex) {
      state.containers.appContent.html(Handlebars.compile(spellListTemplate[0])(spellIndex[0].results.filter(matchesSearchParam)));
    })
  };


  var renderMySpells = function () {
    $.when(state.promises.spellListTemplate, state.promises.spellIndex, state.promises.clearButtonTemplate).done(function (spellListTemplate, spellIndex, clearButton) {
      state.containers.appContent.html(Handlebars.compile(spellListTemplate[0])(spellIndex[0].results.filter(isKnownSpellUrl)));
      if (spellIndex[0].results.filter(isKnownSpellUrl).length > 0) {state.containers.appContent.append(clearButton[0])};
    })
  };

  var matchesSearchParam = function (el) {
    return el.name.toLowerCase().indexOf(state.searchParam.toLowerCase()) > -1;
  };

  var getIdFromUrl = function (url) {
    return url.replace('http://www.dnd5eapi.co/api/spells/' ,'');
  };

  var isKnownSpellUrl = function (el) {
    return state.knownSpells.indexOf(getIdFromUrl(el.url).toString()) > -1;
  };

  var isKnownSpellId = function (idx) {
    return state.knownSpells.indexOf(idx.toString()) > -1;
  };

  var renderResetButton = function () {

  };

  var renderSpellModal = function () {

  };

  var isEmptyArray = function (array) {
    return array.length === 0;
  }

  var init = function () {
    renderNavBar();
    renderSpellIndex();
  };

  // Handlebars helpers
  Handlebars.registerHelper('getIdFromUrl', getIdFromUrl);
  Handlebars.registerHelper('isKnownSpellUrl', isKnownSpellUrl);
  Handlebars.registerHelper('isKnownSpellId', isKnownSpellId);
  Handlebars.registerHelper('isEmptyArray', isEmptyArray);

  return {
    init: init,
    state: state,
    renderSpellIndex: renderSpellIndex,
    renderMySpells: renderMySpells,
    renderResetButton: renderResetButton,
    getKnownSpellsFromLs: getKnownSpellsFromLs,
    saveKnownSpellsToLs: saveKnownSpellsToLs,
    addToKnownSpells: addToKnownSpells,
    removeFromKnownSpells: removeFromKnownSpells
  };
})();

$.getJSON('http://www.dnd5eapi.co/api/spells').done(function(data){
  window.dndSpellbook.state.spellIndex = data.results;
  window.dndSpellbook.init(); // when ..... done
})

// var promises = dndSpellbook.state.promises;
// $.when( promises.spellIndex, promises.navBarTemplate, promises.spellListTemplate, promises.searchBarTemplate, promises.spellModalTemplate).done(function (data) {
//   console.log(data);
// })
