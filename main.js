var jsVersion = {
  sortBy: 10,
  startPoint: 0,
  top: 3,
  symbols: 1,
  init: function () {
    document.getElementById('prev').addEventListener('click', function (e) {
      e.preventDefault();
      jsVersion.controller(null, false, true);
    });

    document.getElementById('next').addEventListener('click', function (e) {
      e.preventDefault();
      jsVersion.controller(null, true, false);
    });

    document.getElementById('search').addEventListener('input', function (e) {
      if (e.target.value.length >= jsVersion.symbols) {
        jsVersion.finder(e.target.value);
      } else {
        jsVersion.divideBy();
        jsVersion.controller();
      }
    });

    this.loadJSON(function (response) {
      var jsonData = JSON.parse(response);
      jsVersion.sortData(jsonData);
      jsVersion.divideBy();
      jsVersion.controller();
    });
  },
  controller: function (data, next, prev) {
    var _data = data || this.sortedData;
    if (this.sortBy > _data.length) {
      this.paginationRemove();
      this.setData(
        fullList(_data, [this.startPoint, _data.length])
      );
    } else {
      if (next) {
        this.currentP += 1;
        this.setData(
          fullList(_data, this.pairs[this.currentP])
        );
        this.paginationAdd(
          this.pairs[this.currentP - 1] || '',
          this.pairs[this.currentP],
          this.pairs[this.currentP + 1] || ''
        );
      } else if (prev) {
        this.currentP -= 1;
        this.setData(
          fullList(_data, this.pairs[this.currentP])
        );
        this.paginationAdd(
          this.pairs[this.currentP - 1] || '',
          this.pairs[this.currentP],
          this.pairs[this.currentP + 1] || ''
        );
      } else {
        this.currentP = 0;
        this.setData(
          fullList(_data, this.pairs[this.currentP])
        );
        this.paginationAdd(
          '',
          this.pairs[this.currentP],
          this.pairs[this.currentP + 1] || ''
        );
      }
    }

    function fullList(data, pair) {
      return jsVersion.createList(data, pair[0], pair[1]);
    }
  },
  createList: function (sortedData, from, to) {
    var fullList = '<ul>';

    for (var i = from; i < to; i++) {
      fullList += createOne(i, sortedData[i]);
    }

    fullList += '</ul>';
    return fullList;

    function createOne(id, data) {
      function rndmClr() {
        return (Math.random() * 255).toFixed();
      }

      var _color = 'rgb(' + rndmClr() + ',' + rndmClr() + ',' + rndmClr() + ')';

      var author = '<li>';
      author += '<div class="number">' + (id + 1) + '</div>';
      author += '<div class="authors_cred">';
      author += '<div class="label" style="background-color:' + _color + '">' + data["name"][0] + '</div>';
      author += '<div class="name">' + data["name"] + '</div>';
      author += '<div class="count_pub">' + data["count_pub"] + ' публ.</div>';
      author += '</div>';
      if (data.top) author += '<div class="star star_' + data.top + '"></div>';
      author += '<div class="pageviews">' + data["pageviews"] + '</div>';
      author += '</li>';

      return author;
    }
  },
  divideBy: function (data) {
    var _data = data || this.sortedData;
    this.pairs = [];
    if (this.sortBy > _data.length) {
      this.pairs.push([this.startPoint, _data.length]);
    } else {
      for
      (
        var i = 0;
        (i + this.sortBy < _data.length) || ((i + this.sortBy) - _data.length >= 0 && (i + this.sortBy) - _data.length < this.sortBy);
        i += this.sortBy
      ) {
        if (i + this.sortBy < _data.length) {
          this.pairs.push([i, i + this.sortBy]);
        } else {
          this.pairs.push([i, _data.length]);
        }
      }
    }
  },
  finder: function (str) {
    var result = [],
      _str = str.toLowerCase();

    for (var i = 0; i < this.sortedData.length; i++) {
      var _name = this.sortedData[i]['name'].toLowerCase();

      if (~_name.indexOf(_str)) {
        result.push(this.sortedData[i]);
      }
    }

    if (result.length != this.sortedData.length) {
      this.divideBy(result);
      this.controller(result);
    }
  },
  loadJSON: function (callback) {
    var xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'resources/data.json', true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
      }
    };

    xobj.send(null);
  },
  markTop: function () {
    for (var i = 0; i < this.top; i++) {
      this.sortedData[i].top = i + 1;
    }
  },
  paginationAdd: function (prev, current, next) {
    var prevBtn = document.getElementById('prev'),
      currentBtn = document.getElementById('current'),
      nextBtn = document.getElementById('next');

    document.querySelector('.pagination').style.display = '';

    if (prev != '') {
      prevBtn.innerHTML = (prev[0] + 1) + ' - ' + prev[1];
      prevBtn.style.display = '';
    } else {
      prevBtn.innerHTML = '';
      prevBtn.style.display = 'none';
    }

    if (current != '') {
      currentBtn.innerHTML = (current[0] + 1) + ' - ' + current[1];
      currentBtn.style.display = '';
    } else {
      currentBtn.innerHTML = '';
      currentBtn.style.display = 'none';
    }

    if (next != '') {
      nextBtn.innerHTML = (next[0] + 1) + ' - ' + next[1];
      nextBtn.style.display = '';
    } else {
      nextBtn.innerHTML = '';
      nextBtn.style.display = 'none';
    }

  },
  paginationRemove: function () {
    document.querySelector('.pagination').style.display = 'none';
  },
  setData: function (fullList) {
    document.querySelector('.authors').innerHTML = fullList;
  },
  sortData: function (data) {
    this.sortedData = data.sort(comparePageviews);
    this.markTop();

    function comparePageviews(a, b) {
      if (a['pageviews'] > b['pageviews']) return -1;
      if (a['pageviews'] < b['pageviews']) return 1;
    }
  }
};

jsVersion.init();