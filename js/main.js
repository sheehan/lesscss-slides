$(function () {
    $.deck('.slide');

    less.watch();

    var createEditorPair = function (el) {
        ({
            init:function () {
                this.parser = new (less.Parser);

                this.lessEditor = CodeMirror.fromTextArea(el, {
                    mode:'css',
                    onUpdate:this.syncEditors.bind(this)
                });
                $(this.lessEditor.getWrapperElement()).addClass('less');

                var css = this.parseCss(this.lessEditor.getValue());

                this.cssEditor = CodeMirror(function (e) {
                    $(this.lessEditor.getWrapperElement()).after(e);
                }.bind(this), {
                    value:css,
                    mode:'css'
                });

                $(this.cssEditor.getWrapperElement()).addClass('css');

            },

            syncEditors:function () {
                if (this.lessEditor) {
                    var css = this.parseCss(this.lessEditor.getValue());
                    if (this.cssEditor && css !== null) {
                        this.cssEditor.setValue(css);
                    }
                }
            },

            parseCss:function () {
                var css = null;
                this.parser.parse(this.lessEditor.getValue(), function (err, tree) {
                    if (!err) {
                        css = tree.toCSS();
                    }
                });
                return css;
            }
        }.init());
    };

    $('textarea.less').each(function (index, el) {
        createEditorPair(el);
    });

});