
let path;
let win;
document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById("save");
    button.addEventListener('click', function () {
        console.log("save!");
        let name = document.getElementById("name").value;
        let code = document.getElementById("code").value;
        console.log(name);
        console.log(code);
        const response = window.bookmark.edit_bookmark(path, {"name": name, "code": code}, win)
        // response.then((value) => {
        //     console.log(value)
        //     // getCurrentWindow().close();
        //     window.bookmark.close_event({"name": name, "code": code})

        // })
    });

    const run = document.getElementById("run");
    run.addEventListener('click', function () {
        console.log("run!");
        const response = window.bookmark.run_bookmark(path)
        // response.then((value) => {
        //     console.log(value)
        //     // getCurrentWindow().close();
        //     window.bookmark.close_event({"name": name, "code": code})

        // })
    });

});

document.addEventListener('DOMContentLoaded', function () {
    window.bookmark.get_info((info) => {
        console.log(info);
        document.getElementById("name").value = info.name;
        document.getElementById("code").value = info.code;
        path = info.path;
        win = info.win;
    });
});
