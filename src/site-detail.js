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

// console.log(sites)

const realmApp = new Realm.App({
    id: "mongoapp-ucffa"
});

const URL_PARAMS = new URLSearchParams(window.location.search)

const siteIdParams = URL_PARAMS.get("site_id");
console.log(siteIdParams)

const siteData = sites.find(site => siteIdParams === site.sight_id.toString());

// console.log(siteData)

const siteImg = document.getElementById('site-image')
const siteName = document.getElementById('site-name')
const siteLocation = document.getElementById('site-location')
const commentContatiner = document.getElementById('comment-list-container');
const deleteBtn = document.getElementById('delete-button');
const commentBox = document.getElementById('comment');

siteImg.src = siteData.image_url;
siteImg.alt = siteData.name;
siteName.innerText = siteData.name;
siteLocation.innerText - siteData.location;


const fetchComments = async () => {
    const commentFromDB = await realmApp.currentUser
        .mongoClient("mongodb-atlas")
        .db("mongoApp")
        .collection("comments")
        .find({
            sight_id: siteIdParams,
        });
    return commentFromDB;
}


const insertSingleCommentToContainer = (constainer, comment) => {
    const singleComment = `
            <li>
            <div class="flex space-x-3">                                       
              <div>                                        
                <div class="mt-1 text-sm text-gray-700">
                  <p class="comment-text">${comment.comment}</p>
                </div>
                <div class="mt-2 text-sm space-x-2">                                           
                  <button id="delete-button" onclick="onDeleteClicked('${comment._id.toString()}')" type="button" class="text-gray-900 font-medium">Delete</button>
                  <button onclick="updateClicked(this)" data-siteID="${comment._id.toString()}" type="button" class="text-gray-900 font-medium">Update</button>
                </div>
              </div>
            </div>
          </li> 
            `;
    constainer.insertAdjacentHTML("beforeend", singleComment);
}


const fillCommentsContatiner = (comments) => {
    commentContatiner.innerHTML = "";

    comments.forEach(comment => {
        insertSingleCommentToContainer(commentContatiner, comment)
    })
}

const insertCommentInDB = async (cmnt) => {
    const insertedCmnt = await realmApp.currentUser.callFunction('comment', {
        sight_id: siteIdParams.toString(),
        comment: cmnt,
        commenter: realmApp?.currentUser?.id
    });


    // const insertedCmnt = await realmApp.currentUser
    //     .mongoClient("mongodb-atlas")
    //     .db("mongoApp")
    //     .collection("comments")
    //     .insertOne({
    //         sight_id: siteIdParams.toString(),
    //         comment: cmnt,
    //         commenter: realmApp?.currentUser?.id
    //     });
    return insertedCmnt
}


async function onCommentClicked() {


    try {
        const insertedComment = await insertCommentInDB(commentBox.value);
        console.log(insertedComment)
        const comments = await fetchComments();
        fillCommentsContatiner(comments)
        commentBox.value = ''
    } catch (error) {
        console.log(error)
    }


}

const deleteCommentFromDB = async (commentId) => {
    const deletedComment = await realmApp.currentUser
        .mongoClient("mongodb-atlas")
        .db("mongoApp")
        .collection("comments")
        .deleteOne({
            _id: commentId,
        });

    return deletedComment
}

async function onDeleteClicked(id) {
    console.log('hi form delte')

    const commentId = Realm.BSON.ObjectId.createFromHexString(id);
    const deletedComment = await deleteCommentFromDB(commentId);
    console.log('deleted: ', deletedComment);

    const comments = await fetchComments();
    fillCommentsContatiner(comments)
}

const updateClicked = (buttonElement) => {
    window.location.href = `comment-update.html?comment-id=${buttonElement.dataset.siteid}&&site_id=${siteIdParams}`;
}