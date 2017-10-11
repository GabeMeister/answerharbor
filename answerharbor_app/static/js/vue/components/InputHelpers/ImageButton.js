Vue.component('ImgBtn', {
    template: `
        <span>
            <button type="button" class="btn btn-default" data-toggle="modal" :data-target="modalIdHtml" @click="initModal">Image</button>
            <div class="modal fade" :id="modalId" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Image Upload</h4>
                        </div>
                        <div class="modal-body">
                            <label for="img-url">
                                <h3>Temporary Image Url:</h3>
                            </label>
                            <br/>
                            <input
                                type="text"
                                class="form-control"
                                :id="inputId"
                                :name="inputId"
                                v-model="tempImgUrl"
                                placeholder="Temporary Image Url"/>
                        </div>
                        <div class="modal-footer">
                            <button type="button"
                                class="btn btn-default"
                                data-dismiss="modal"
                                @click="upload">Upload to Imgur</button>
                        </div>
                    </div>

                </div>
            </div>
            <div class="popup-background" :class="{'hidden-buffer': !uploading}"></div>
            <div class="popup" :class="{'hidden-buffer': !uploading}">
                <img class="loading-spinner" src="https://i.imgur.com/RN1IWOe.gif"/>
            </div>
        </span>
    `,
    props: {
        parentId: {
            type: String,
            required: true
        }
    },
    computed: {
        modalId: function() {
            return this.parentId + '_img_modal';
        },
        modalIdHtml: function() {
            return '#'+this.modalId;
        },
        inputId: function() {
            return this.parentId + '_img_input';
        },
        linkMarkdown: function() {
            return '![IMAGE_DESCRIPTION_HERE](' + this.imgurUrl + ')';
        }
    },
    data() {
        return {
            tempImgUrl: '',
            imgurUrl: '',
            uploading: false,
            beginIndex: 2,
            endIndex: 24
        };
    },
    methods: {
        initModal: function() {
            this.tempImgUrl = '';
        },
        upload: function() {
            var clientId = window.imgurApiClientId;
            this.uploading = true;

            if(this.tempImgUrl !== '') {
                $.ajax({
                    type: 'POST',
                    url: 'https://api.imgur.com/3/image',
                    headers: {
                        'Authorization': 'Client-ID ' + clientId
                    },
                    data: {
                        image: this.tempImgUrl
                    },
                    success: response => {
                        this.imgurUrl = response.data.link;
                        this.$emit('onClicked', this.addImg);
                        this.uploading = false;
                    },
                    error: e => {
                        console.error(e);
                        this.uploading = false;
                    }
                });
            }
        },
        addImg: function(textareaElem) {
            var cursorPosition = textareaElem.selectionEnd;
            var text = textareaElem.value;

            var prefix = text.slice(0, cursorPosition);
            var suffix = text.slice(cursorPosition);
            var finalText = prefix + this.linkMarkdown + suffix;

            textareaElem.value = finalText;
            textareaElem.focus();
            textareaElem.setSelectionRange(cursorPosition + this.beginIndex, cursorPosition + this.endIndex);

            return finalText;
        }
    }
});
