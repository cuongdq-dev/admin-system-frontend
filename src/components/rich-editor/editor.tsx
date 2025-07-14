import { Component, createRef } from 'react';
import suneditor from 'suneditor';
import 'suneditor/dist/css/suneditor.min.css';
import { en } from 'suneditor/src/lang';
import plugins from 'suneditor/src/plugins';
import './style.scss';

import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

interface Props {
  contents?: string;
  onBlur?: Function;
  onChange?: Function;
  onSave: Function;
  disabled?: boolean;
}

interface State {
  previousContents: string;
}

class Editor extends Component<Props, State> {
  txtArea: any;
  editor: any;

  constructor(props: any) {
    super(props);
    this.txtArea = createRef();
    this.state = {
      previousContents: props.contents || '',
    };
  }

  componentDidMount() {
    const editor: any = (this.editor = suneditor.create(this.txtArea.current, {
      plugins: plugins,
      lang: en,
      callBackSave: (contents: string) => this.props.onSave(contents),
      stickyToolbar: '73px',
      fullScreenOffset: 0,
      width: '100%',
      height: 'calc(100vh - 160px)',
      value: this.props.contents,
      imageMultipleFile: true,
      fullPage: false,
      defaultStyle:
        'color: var(--palette-text-primary); background-color: var(--palette-background-paper);',

      previewTemplate: `
                <div style="width:auto; max-width:1136px; min-height:400px; margin:auto;">
                {{contents}}
                </div>
            `,
      buttonList: [
        // default
        ['undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['paragraphStyle', 'blockquote'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor', 'textStyle'],
        ['removeFormat'],
        ['outdent', 'indent'],
        ['align', 'horizontalRule', 'list', 'lineHeight'],
        ['table', 'link', 'image', 'video'],
        ['fullScreen', 'showBlocks', 'codeView'],
        ['preview'],
        ['save'],
        // responsive
        [
          '%1161',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['fontColor', 'hiliteColor', 'textStyle'],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
            ['-right', ':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
          ],
        ],
        [
          '%893',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            ['bold', 'underline', 'italic', 'strike'],
            [
              ':t-Fonts-default.more_text',
              'subscript',
              'superscript',
              'fontColor',
              'hiliteColor',
              'textStyle',
            ],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
            ['-right', ':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
          ],
        ],
        [
          '%855',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            [
              ':t-Fonts-default.more_text',
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
              'fontColor',
              'hiliteColor',
              'textStyle',
            ],
            ['removeFormat'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'lineHeight'],
            [':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
          ],
        ],
        [
          '%563',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            [
              ':t-Fonts-default.more_text',
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
              'fontColor',
              'hiliteColor',
              'textStyle',
            ],
            ['removeFormat'],
            ['outdent', 'indent'],
            [
              ':e-List&Line-default.more_horizontal',
              'align',
              'horizontalRule',
              'list',
              'lineHeight',
            ],
            [':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
          ],
        ],
        [
          '%458',
          [
            ['undo', 'redo'],
            [
              ':p-Formats-default.more_paragraph',
              'font',
              'fontSize',
              'formatBlock',
              'paragraphStyle',
              'blockquote',
            ],
            [
              ':t-Fonts-default.more_text',
              'bold',
              'underline',
              'italic',
              'strike',
              'subscript',
              'superscript',
              'fontColor',
              'hiliteColor',
              'textStyle',
              'removeFormat',
            ],
            [
              ':e-List&Line-default.more_horizontal',
              'outdent',
              'indent',
              'align',
              'horizontalRule',
              'list',
              'lineHeight',
            ],
            [':r-Table&Media-default.more_plus', 'table', 'link', 'image', 'video'],
            ['-right', 'save'],
            [
              '-right',
              ':i-Etc-default.more_vertical',
              'fullScreen',
              'showBlocks',
              'codeView',
              'preview',
            ],
          ],
        ],
      ],
    }));

    editor.onBlur = () => {
      if (typeof this.props.onBlur === 'function') this.props.onBlur(editor.getContents());
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.contents !== prevProps.contents) {
      this.editor.setContents(this.props.contents || '');
      this.setState({ previousContents: this.props.contents || '' }); // Sync with new content
      this.editor.core.history.reset(true);
    }
  }

  componentWillUnmount() {
    if (this.editor) this.editor.destroy();
  }

  render() {
    return <textarea ref={this.txtArea} />;
  }
}

export default Editor;
