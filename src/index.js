const realmApp = new Realm.App({
  id: "mongoapp-ucffa"
});

const authenTicateUserAnonymously = async () => {
  const anonymousUser = await realmApp.logIn(Realm.Credentials.anonymous());
  console.log(anonymousUser);

}

if (!realmApp?.currentUser?.isLoggedIn) {
  authenTicateUserAnonymously();
}

console.log(realmApp?.currentUser?.customData)
// module.export(sites)
const sites = [
  {
    "sight_id": 1,
    "name": "Lagos Harbour",
    "location": "Lagos, Nigeria",
    "image_url": "https://firebasestorage.googleapis.com/v0/b/wazobia-a843d.appspot.com/o/lagos-harbour.jpg?alt=media&token=3759ab64-709b-42fb-9855-65f8fb8a5fbf"
  },
  {
    "sight_id": 2,
    "name": "African Renaissance Monument",
    "location": "Dakar, Senegal",
    "image_url": "https://firebasestorage.googleapis.com/v0/b/wazobia-a843d.appspot.com/o/african-renaissance-monument.jpg?alt=media&token=2690587e-e366-4150-9e8e-4b7e1dc67cf4"
  },
  {
    "sight_id": 3,
    "name": "St. Paul's Cathedral",
    "location": "Abidjan, Cote D'Ivoire",
    "image_url": "https://firebasestorage.googleapis.com/v0/b/wazobia-a843d.appspot.com/o/st-pauls-cathedral.jpg?alt=media&token=dab2fbf0-e81b-425f-83e5-03fc0cdfb41b"
  },
  {
    "sight_id": 4,
    "name": "Fathala Wildlife Reserve",
    "location": "Karang, Senegal",
    "image_url": "https://firebasestorage.googleapis.com/v0/b/wazobia-a843d.appspot.com/o/fathala.jpg?alt=media&token=693134b5-c485-486e-892c-c9a5ce520458"
  },
  {
    "sight_id": 5,
    "name": "Tamala Resort",
    "location": "Serrekunda, Gambia",
    "image_url": "https://firebasestorage.googleapis.com/v0/b/wazobia-a843d.appspot.com/o/tamala-resort.jpg?alt=media&token=67c09ee6-7db4-497a-b40c-8b9a74e74890"
  },
  {
    "sight_id": 6,
    "name": "Black Start Monument",
    "location": "Accra, Ghana",
    "image_url": "https://firebasestorage.googleapis.com/v0/b/wazobia-a843d.appspot.com/o/black-start-square.jpg?alt=media&token=668a24b1-2585-4a01-8bb5-d1cbd68be951"
  },
  {
    "sight_id": 7,
    "name": "Independence Arch",
    "location": "Accra, Ghana",
    "image_url": "https://firebasestorage.googleapis.com/v0/b/wazobia-a843d.appspot.com/o/independence-arch.jpg?alt=media&token=fad917fb-c489-43ce-afef-0df56fa59914"
  },
  {
    "sight_id": 8,
    "name": "Place du Souvenir Africain",
    "location": "Dakar, Senegal",
    "image_url": "https://firebasestorage.googleapis.com/v0/b/wazobia-a843d.appspot.com/o/place-souvenir.jpg?alt=media&token=d6f7ea5f-5e13-4198-b979-b56f861d8c3e"
  }
];

const sitesListContainer = document.getElementById('site-list');

async function onVoteButtonClicked(siteId) {
  console.log("hello form click")

  const insertVote = await realmApp.currentUser
    .mongoClient("mongodb-atlas")
    .db("mongoApp")
    .collection("likes")
    .insertOne({
      sight_id: siteId.toString(),
      voter_id: realmApp.currentUser.id
    });
  console.log('vote', insertVote)

  const buttonOnUpdate = document.getElementById(`vote-count-${siteId}`);

  const voteCount = await realmApp.currentUser
    .mongoClient("mongodb-atlas")
    .db("mongoApp")
    .collection("likes")
    .count({
      sight_id: siteId.toString()
    });
  buttonOnUpdate.innerText = voteCount;

}

sites.forEach((data) => {
  const siteItemFragment = `
    <div id="${data.sight_id}" class="group site-card">
    <div class="mb-2">
      <span class="relative z-0 inline-flex shadow-sm rounded-md">
        <button
            onClick="onVoteButtonClicked(${data.sight_id})"
            id="vote-button-${data.sight_id}"
          type="button"
          class="vote-button relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <svg
            class="-ml-1 mr-2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Like
        </button>
        <button
            id="vote-count-${data.sight_id}"
          type="button"
          class="vote-count -ml-px relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          0
        </button>
      </span>
    </div>
  
    <a href="site-detail.html?site_id=${data.sight_id}">
      <div
        class="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8"
      >
        <img
          src="${data.image_url}"
          alt="${data.name}"
          class="w-full h-full object-center object-cover group-hover:opacity-75 site-image"
        />
      </div>
  
      <h3 class="mt-4 text-sm text-gray-700 site-location">
        ${data.location}
      </h3>
      <p class="mt-1 text-lg font-medium text-gray-900 site-name">
        ${data.name}
      </p>
    </a>
  </div>`;

  sitesListContainer.insertAdjacentHTML("beforeend", siteItemFragment);
})


// export {sites}