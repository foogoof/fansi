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

fansi.advance_cursor = function(places) {
    if (!places) {
        places = 1;
    }
    this.term.pos.col++;
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

$(document).ready(function() {
    fansi.setup();
    fansi.build_term();
    socket.on('message',
              function(data) {
                  console.log('lookit -- I got: ' + data.toString());
              });
    socket.on('disconnect', function() { alert('disconnected'); });
    socket.connect();
});
