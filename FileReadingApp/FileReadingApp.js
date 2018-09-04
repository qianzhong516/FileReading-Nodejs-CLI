/*
Author: Janice Zhong,
Date: 03/09/2018
Project: File Reading App
*/

/*
1. Reading Files and Directories,  
2. Ask for user input, 
3. Accept input, 
4. Show next level of directory
Repeating...
*/
var fs = require("fs"),
    stdin=process.stdin,
    stdout = process.stdout,
    filename = "/",
    stats = [];

listing(filename, 0);

function listing(filename, i) {   
    //step 1
    fs.readdir(__dirname + filename, "utf8", function (err, files) {
        var name = files[i];
        //listing all the files and directories
        fs.stat(__dirname + filename + name, function (err, stat) {
            stats[i] = stat;
            if (stat.isDirectory()) {
                console.log(" " + i + ". " + name + "/");
            } else {
                console.log(" " + i + ". " + name);
            }
            i++;
            if (i == files.length) {
                //step 2
                read();
                function read() {
                    console.log(' ');
                    stdout.write('Enter your choice (Press 999 to exit): ');
                    stdin.resume();
                    stdin.once('data', option);
                }
                //step 3
                function option(data) {
                    stdin.pause();
                    var filename_next_lvl = files[Number(data)];
                    var fileStat = stats[Number(data)];
                    //reset
                    stats = [];                   
                    // if the input is invalid 
                    if (!filename_next_lvl) {                       
                        if (data== 999) {
                            process.exit(1);
                        } else {
                            console.log('Wrong Input Detected.');
                            read();
                        }
                    } else {
                        if (fileStat.isDirectory()) {
                            //step 4
                            //call this function again
                            filename += filename_next_lvl + "/";
                            listing(filename, 0);
                        } else {
                            fs.readFile(__dirname + filename + filename_next_lvl, "utf8", function (err, content) {
                                console.log("/*************File Content**************/\n");
                                console.log(content);
                                console.log("/*************File Content End**********/\n");
                            });
                        }
                    }
                }
            } else {
                //looping through the files in the same directory
                listing(filename,i);
            }
        });
    });
}