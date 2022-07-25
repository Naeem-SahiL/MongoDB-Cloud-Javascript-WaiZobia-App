const REALM_APP = new Realm.App({
    id: "mongoapp-ucffa"
});

const URL_PARAMS = new URLSearchParams(window.location.search);
const COMMENT_ID_PARAM = URL_PARAMS.get("comment-id");
const SITE_ID_PARAM = URL_PARAMS.get("site_id");
console.log(COMMENT_ID_PARAM)
console.log(SITE_ID_PARAM)

const COMMENT_BOX = document.getElementById("comment");
const COMMENT_OBJECT_ID = Realm.BSON.ObjectId.createFromHexString(COMMENT_ID_PARAM);

async function onUpdateButtonClicked() {
    try {
        const COMMENT_UPDATE_OPERATION = await REALM_APP.currentUser
            .mongoClient("mongodb-atlas")
            .db("mongoApp")
            .collection("comments")
            .updateOne({
                _id: COMMENT_OBJECT_ID
            }, {
                "$set": {
                    "comment": COMMENT_BOX.value
                }
            });

        console.log(COMMENT_UPDATE_OPERATION);

    } catch (error) {
        console.log(error);
    }

}

async function FetchCommentToUpdate() {
    try {
        const COMMENT_TO_UPDATE = await REALM_APP.currentUser
            .mongoClient("mongodb-atlas")
            .db("mongoApp")
            .collection("comments")
            .findOne({
                _id: COMMENT_OBJECT_ID
            });

        COMMENT_BOX.value = COMMENT_TO_UPDATE.comment;

    } catch (error) {
        console.log(error);
    }
}

FetchCommentToUpdate();

const onBackButtonClicked = () => {
    window.location.href = `site-detail.html?site_id=${SITE_ID_PARAM}`
}