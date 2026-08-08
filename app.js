function getApplications() {
    try {
        return JSON.parse(
            localStorage.getItem("ecs_applications") || "[]"
        );
    } catch (error) {
        return [];
    }
}


function saveApplications(applications) {
    localStorage.setItem(
        "ecs_applications",
        JSON.stringify(applications)
    );
}


function generateApplicationId() {
    const number =
        Math.floor(100000 + Math.random() * 900000);

    return "ECS-" + number;
}


/* CUSTOMER APPLICATION */

const loanForm =
    document.getElementById("loanForm");


if (loanForm) {

    loanForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const formData =
                new FormData(loanForm);

            const applications =
                getApplications();


            const application = {

                id: generateApplicationId(),

                name:
                    formData.get("name") || "",

                mobile:
                    formData.get("mobile") || "",

                email:
                    formData.get("email") || "",

                city:
                    formData.get("city") || "",

                loanType:
                    formData.get("loanType") || "",

                amount:
                    Number(
                        formData.get("amount") || 0
                    ),

                employment:
                    formData.get("employment") || "",

                income:
                    Number(
                        formData.get("income") || 0
                    ),

                status:
                    "New",

                caller:
                    "Unassigned",

                created:
                    new Date().toLocaleString("en-IN")

            };


            applications.unshift(application);


            saveApplications(
                applications
            );


            const success =
                document.getElementById(
                    "successMessage"
                );


            success.classList.remove(
                "hidden"
            );


            success.textContent =
                "Application submitted successfully. Your Application ID is "
                + application.id;


            loanForm.reset();

        }
    );

}


/* ADMIN DASHBOARD */

function renderDashboard() {

    const rows =
        document.getElementById(
            "applicationRows"
        );


    if (!rows) {
        return;
    }


    const applications =
        getApplications();


    const searchBox =
        document.getElementById(
            "searchApplications"
        );


    const search =
        searchBox
            ? searchBox.value.toLowerCase()
            : "";


    const filtered =
        applications.filter(
            function (application) {

                const text =
                    (
                        application.name +
                        " " +
                        application.mobile
                    ).toLowerCase();


                return text.includes(search);

            }
        );


    document.getElementById(
        "totalApplications"
    ).textContent =
        applications.length;


    document.getElementById(
        "newApplications"
    ).textContent =
        applications.filter(
            function (application) {
                return application.status === "New";
            }
        ).length;


    document.getElementById(
        "reviewApplications"
    ).textContent =
        applications.filter(
            function (application) {
                return application.status === "In Review";
            }
        ).length;


    document.getElementById(
        "approvedApplications"
    ).textContent =
        applications.filter(
            function (application) {
                return application.status === "Approved";
            }
        ).length;


    if (filtered.length === 0) {

        rows.innerHTML = `
            <tr>
                <td colspan="7">
                    No applications found.
                </td>
            </tr>
        `;

        return;
    }


    rows.innerHTML =
        filtered.map(
            function (application) {

                return `
                    <tr>

                        <td>
                            ${escapeHTML(application.id)}
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(application.name)}
                            </strong>
                            <br>
                            ${escapeHTML(application.mobile)}
                        </td>

                        <td>
                            ${escapeHTML(application.loanType)}
                        </td>

                        <td>
                            ₹${Number(
                                application.amount || 0
                            ).toLocaleString("en-IN")}
                        </td>

                        <td>
                            ${escapeHTML(application.status)}
                        </td>

                        <td>
                            ${escapeHTML(application.caller)}
                        </td>

                        <td>
                            ${escapeHTML(application.created)}
                        </td>

                    </tr>
                `;

            }
        ).join("");

}


/* SEARCH */

const searchApplications =
    document.getElementById(
        "searchApplications"
    );


if (searchApplications) {

    searchApplications.addEventListener(
        "input",
        renderDashboard
    );

}


/* CLEAR DEMO DATA */

function clearDemoData() {

    const confirmed =
        confirm(
            "Are you sure you want to delete all demo applications?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "ecs_applications"
    );


    renderDashboard();

}


/* SECURITY */

function escapeHTML(value) {

    return String(
        value ?? ""
    ).replace(
        /[&<>"']/g,
        function (character) {

            const entities = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };

            return entities[character];

        }
    );

}


/* LOAD DASHBOARD */

renderDashboard();