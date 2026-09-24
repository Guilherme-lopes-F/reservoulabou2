setTimeout(() => {

    document

        .querySelectorAll(".alert")

        .forEach(alert => {

            alert.style.opacity = "0";

            setTimeout(() => {

                alert.remove();

            },500);

        });

},4000);
