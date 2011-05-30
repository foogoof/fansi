// fansi is a javascript project to convert control sequences into events
//
// Copyright (C) 2011  Seth Schroeder <foogoof@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

var socket = new io.Socket();

if (typeof fansi === 'undefined') {
    var fansi = {};
}

fansi.setup = function () {
    var term = $('#terminal');
    var content = $("#terminal .content"); 
    
    term.dim = {
        col: 80,
        row: 24
    };

    term.pos = {
        col: 0,
        row: 0
    };

    term.content = content;    
    fansi.term = term;
};

fansi.write_char = function(chr) {
    var cell = this.get_current_cell();
    cell.empty();
    cell.append(chr);
};

fansi.advance_cursor = function(cols) {
    if (!cols) {
        cols = 1;
    }
    
    if (this.term.pos.col + cols < this.term.dim.col) {
        this.term.pos.col += cols;
    }
};

fansi.cursor_down = function(rows) {
    if (!rows) {
        rows = 1;
    }
    
    if (this.term.pos.row + rows < this.term.dim.col) {
        this.term.pos.row += rows;
    }
};

fansi.cursor_position = function(coords) {
    this.term.pos.row = coords.row;
    this.term.pos.col = coords.col;
};

fansi.write_and_advance = function(chr) {
    this.write_char(chr);
    this.advance_cursor();
};

fansi.cell_id = function(pos) {
    return "r" + pos.row + "c" + pos.col;
};

fansi.get_current_cell = function() {
    return this.get_cell(this.term.pos);
};

fansi.carriage_return = function() {
    this.term.pos.col = 0;
};

fansi.get_cell = function(pos) {
    var cell_id = this.cell_id(pos);
    return $("#" + cell_id);
};

fansi.add_row = function(row_num) {
    var html = "";
    var col, id, cell;

    for (col = 0; col < this.term.dim.col; col++) {
        id = "r" + row_num + "c" + col;
        cell = "<span class='cell' id='" + id + "'>" + '&nbsp;' + "</span>";
        html += cell;
    }

    this.term.content.append("<div>" + html + "</div>");
};

fansi.build_term = function() {
    var row;
    for (row = 0; row < this.term.dim.row; row++) {
        this.add_row(row);
    }
};

fansi.write_text = function(text) {
    var i;

    for (i = 0; i < text.length; i++) {
        if ('\r' === text[i]) {
            this.carriage_return();
        } else {
            this.write_and_advance(text[i]);
        }
    }
};

$(document).ready(function() {
    fansi.setup();
    fansi.build_term();
    socket.on('message',
              function(data) {
                  var msg, txt, params, coord;

                  txt = data.toString();
                  //console.log('lookit -- I got: %s', txt);

                  msg = JSON.parse(txt);
                  params = msg.data[0];

                  // TODO let's not do this the worst possible way
                  if (msg.event === 'raw_text') {
                      fansi.write_text(params);
                  } else if (msg.event === 'CursorForward') {
                      fansi.advance_cursor(params);
                  } else if (msg.event === 'CursorDown') {
                      fansi.cursor_down(params);
                  } else if (msg.event === 'CursorPosition') {
                      coord = { row: 0, col: 0 };
                      // server needs always send TWO values, ambiguous when only one provided
                      // top left corner is 1, 1 over the wire, but map it to 0, 0 here
                      if (msg.data.length !== 2) {
                          throw new Error("crappy params!");
                      }
                      coord.row = msg.data[0] - 1;
                      coord.col = msg.data[1] - 1;
                      fansi.cursor_position(coord);
                  } else {
                      throw new Error("wtf is this opcode: " + msg.event);
                  }
              });
    socket.on('disconnect', function() { alert('disconnected'); });
    socket.connect();
});
