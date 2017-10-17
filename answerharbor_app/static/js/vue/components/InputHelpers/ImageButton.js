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

                            <div>
                                <br/>
                                <h4>- OR -</h4>
                            </div>

                            <div>
                                <label for="img-url">
                                    <h3>Browse for File:</h3>
                                </label>
                                <input
                                    type="file"
                                    :id="fileInputId"
                                    :name="fileInputId"
                                    accept="image/*"
                                    @change="filesChange($event.target.name, $event.target.files)"/>
                            </div>
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
            return 'img_modal_' + this.parentId;
        },
        modalIdHtml: function() {
            return '#'+this.modalId;
        },
        inputId: function() {
            return 'img_input_' + this.parentId;
        },
        fileInputId: function() {
            return 'file_input_' + this.parentId;
        },
        linkMarkdown: function() {
            return '![IMAGE_DESCRIPTION_HERE](' + this.imgurUrl + ')';
        },
        imgurClientId: function() {
            return window.imgurApiClientId;
        }
    },
    data() {
        return {
            tempImgUrl: '',
            tempFile: null,
            imgurUrl: '',
            uploading: false,
            beginIndex: 2,
            endIndex: 24
        };
    },
    methods: {
        initModal: function() {
            this.tempImgUrl = '';
            this.tempFile = null;
            // Clear any value for the file input
            $('#'+this.fileInputId).get(0).value = null;

            // Auto-focus the url text input
            // Need the brief timeout because of the modal window?
            setTimeout(() => {
                $('#'+this.inputId).get(0).focus();
            }, 500);
        },
        upload: function() {
            // Check for either the image url or the local file upload
            if(this.tempImgUrl !== '') {
                this.uploadUrl();
            }
            else if (this.tempFile !== null) {
                this.uploadLocalFile();
            }
        },
        uploadUrl: function() {
            this.uploading = true;

            $.ajax({
                type: 'POST',
                url: 'https://api.imgur.com/3/image',
                headers: {
                    'Authorization': 'Client-ID ' + this.imgurClientId
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
        },
        uploadLocalFile: function() {
            this.uploading = true;

            // To make the ajax request work with an image we need to use FormData
            var formData = new FormData();
            formData.append('image', this.tempFile);

            $.ajax({
                type: 'POST',
                url: 'https://api.imgur.com/3/image',
                processData: false,
                contentType: false,
                headers: {
                    'Authorization': 'Client-ID ' + this.imgurClientId
                },
                data: formData,
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
        },
        filesChange: function(fieldName, fileList) {
            this.tempFile = fileList[0];
        }
    }
});
