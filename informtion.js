const churchNames = {
      "Church 1": "Bulaong",
      "Church 2": "Cornerstone",
      "Church 3": "Emmanuel",
      "Church 4": "Country Garden",
      "Church 5": "Newland",
      "Church 6": "New Galilie",
      "Church 7": "Paopao",
      "Church 8": "New Canaan",
      "Church 9": "Nearest Heaven"
    };

    let isAdmin = false;

    function toggleSidebar() {
      document.querySelector('.sidebar').classList.toggle('open');
    }

    function toggleForm() {
      document.getElementById("member-form").classList.toggle("open");
    }

    function loginAsAdmin() {
      const password = document.getElementById("admin-password").value;
      if (password === "admin123") {
        isAdmin = true;
        alert("✅ Admin access granted.");
        loadAllInfo();
        updateClearButton();
      } else {
        alert("❌ Incorrect password.");
      }
      document.getElementById("admin-password").value = "";
    }

    function updateClearButton() {
      const clearDiv = document.getElementById("admin-clear-btn");
      clearDiv.innerHTML = isAdmin
        ? `<button class="clear-btn" onclick="clearAll()">🗑️ Clear ALL Member Info</button>`
        : "";
    }

    function createChurchDivs() {
      const container = document.getElementById("all-churches");
      container.innerHTML = "";

      for (let i = 1; i <= 9; i++) {
        const churchKey = `Church ${i}`;
        const divId = `church${i}-box`;

        container.innerHTML += `
          <div id="${divId}" class="church-box">
            <div class="church-header" onclick="toggleChurch('${divId}')">
            ${churchNames[churchKey]}
            </div>
            <div class="church-content" id="${divId}-content"></div>
          </div>`;
      }
    }

    function toggleChurch(divId) {
      const content = document.getElementById(`${divId}-content`);
      content.style.display = (content.style.display === "block") ? "none" : "block";
    }

    function saveInfo() {
      const church = document.getElementById("church").value;
      const name = document.getElementById("name").value.trim();
      const age = document.getElementById("age").value.trim();
      const birthday = document.getElementById("birthday").value;
      const gender = document.getElementById("gender").value;
      const position = document.getElementById("position").value.trim();
      const photoInput = document.getElementById("photo");

      if (!church || !name || !age || !birthday) {
        alert("Please complete all fields.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const photo = e.target.result;

        const newEntry = { name, age, birthday, gender, position, photo };
        let allData = JSON.parse(localStorage.getItem("membersByChurch")) || {};

        if (!allData[church]) {
          allData[church] = [];
        }
        allData[church].push(newEntry);
        localStorage.setItem("membersByChurch", JSON.stringify(allData));

        document.getElementById("church").value = "";
        document.getElementById("name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("birthday").value = "";
        document.getElementById("gender").value = "Male";
        document.getElementById("position").value = "";
        document.getElementById("photo").value = "";

        loadAllInfo();
        toggleForm();
      };

      if (photoInput.files[0]) {
        reader.readAsDataURL(photoInput.files[0]);
      } else {
        reader.onload({ target: { result: "" } });
      }
    }

    function loadAllInfo() {
      const allData = JSON.parse(localStorage.getItem("membersByChurch")) || {};

      for (let i = 1; i <= 9; i++) {
        const churchKey = `Church ${i}`;
        const contentDiv = document.getElementById(`church${i}-box`).querySelector(".church-content");
        contentDiv.innerHTML = "";

        const members = allData[churchKey];
        if (members && members.length > 0) {
          members.forEach((member, index) => {
            contentDiv.innerHTML += `
              <div class="member-card">
                ${member.photo ? `<img src="${member.photo}">` : `<div style="width:50px;height:50px;background:#ccc;"></div>`}
                <div class="member-info">
                  <p><strong>Name:</strong> ${member.name}</p>
                  <p><strong>Age:</strong> ${member.age}</p>
                  <p><strong>Birthday:</strong> ${member.birthday}</p>
                  <p><strong>Gender:</strong> ${member.gender}</p>
                  <p><strong>Position:</strong> ${member.position || ''}</p>
                  ${isAdmin ? `<button class="delete-btn" onclick="deleteMember('${churchKey}', ${index})">Delete</button>` : ''}
                </div>
              </div>`;
          });
        } else {
          contentDiv.innerHTML = `<p style="color:gray;">No data for this church.</p>`;
        }
      }

      updateClearButton();
    }

    function deleteMember(church, index) {
      let allData = JSON.parse(localStorage.getItem("membersByChurch")) || {};
      if (allData[church] && allData[church][index]) {
        allData[church].splice(index, 1);
        localStorage.setItem("membersByChurch", JSON.stringify(allData));
        loadAllInfo();
      }
    }

    function clearAll() {
      if (confirm("Are you sure you want to delete ALL member info?")) {
        localStorage.removeItem("membersByChurch");
        createChurchDivs();
        loadAllInfo();
      }
    }