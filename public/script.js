// IIFE

(function () {
    Vue.component("image-component", {
        template: "#image-component",
        props: ["id"],
        data: function () {
            return {
                url: "",
                title: "",
                description: "",
                username: "",
                created_at: "",
            };
        },
        watch: {
            id() {
                this.getSpecificImage();
            },
        },
        mounted() {
            this.getSpecificImage();
        },
        methods: {
            closeModal() {
                this.$emit("close-the-component");
            },
            getSpecificImage() {
                axios
                    .get("/images/" + this.id)
                    .then((res) => {
                        console.log(res);
                        this.url = res.data.url;
                        this.title = res.data.title;
                        this.description = res.data.description;
                        this.username = res.data.username;
                        this.created_at = res.data.created_at;
                    })
                    .catch(() => {
                        this.$emit("close-the-component");
                    });
            },
        },
    });
    Vue.component("comment-component", {
        template: "#comment-component",
        props: ["id"],
        data: function () {
            return {
                comments: [],
                username: "",
                comment: "",
            };
        },
        mounted() {
            axios
                .get("/comments/" + this.id)
                .then((res) => {
                    this.comments = res.data;
                })
                .catch((err) => {
                    console.log("error on getting comment by imageId: ", err);
                });
        },

        methods: {
            handleSubmit() {
                axios
                    .post("/comments", {
                        comment: this.comment,
                        username: this.username,
                        image_id: this.id,
                    })
                    .then((res) => {
                        this.comments.unshift(res.data);
                    });
            },
            deleteComment(comment) {
                axios.delete("/comments/" + comment.id).then(() => {
                    this.comments.splice(this.comments.indexOf(comment), 1);
                });
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            images: [],
            newImages: [],
            form: {
                title: "",
                description: "",
                username: "",
                file: "",
            },
            error: false,
            id: location.hash.slice(1),
            hasMore: true,
            comments: [],
            search: "",
        },
        mounted() {
            axios
                .get("/images")
                .then((res) => {
                    this.images = res.data;
                })
                .catch((err) => {
                    console.log("error on getting images: ", err);
                });

            window.addEventListener("hashchange", () => {
                this.id = location.hash.slice(1);
            });

            setInterval(() => {
                axios.get(`/new?id=${this.images[0].id}`).then((res) => {
                    this.newImages = res.data;
                });
            }, 5000);
        },
        methods: {
            handleSubmit() {
                this.error = false;

                console.log("UPDATED", this.form);

                const formData = new FormData();
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                formData.append("file", this.form.file);

                axios
                    .post("/upload", formData)
                    .then((res) => {
                        // reset form
                        this.form.title = "";
                        this.form.description = "";

                        // To reset file, we have to do it on the input directly,
                        // because it's not linked to our Vue data object with v-model.
                        document.querySelector("input[type=file]").value = null;
                        this.images.unshift(res.data[0]);
                    })
                    .catch(() => {
                        this.error = true;
                    });
            },
            openModal(id) {
                location.hash = id;
                this.id = id;
            },
            closingComponent() {
                this.id = null;
                location.hash = "";
            },

            handleFile(e) {
                console.log("handleFile", e.target.files[0]);
                this.form.file = e.target.files[0];
            },
            deleteImage(image) {
                axios.delete("/images/" + image.id).then(() => {
                    this.images.splice(this.images.indexOf(image), 1);
                });
            },

            loadMore() {
                axios
                    .get(`/images?id=${[...this.images].pop().id}`)
                    .then((res) => {
                        if (res.data.length < 6) {
                            this.hasMore = false;
                        }
                        this.images.push(...res.data);
                    });
            },
        },
    });
})();
