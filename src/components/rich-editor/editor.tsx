import { Component, createRef } from 'react';
import suneditor from 'suneditor';
import 'suneditor/dist/css/suneditor.min.css';
import { en } from 'suneditor/src/lang';
import plugins from 'suneditor/src/plugins';
import './style.scss';

interface Props {
  contents?: string;
  onBlur?: Function;
  onChange?: Function;
  onSave: Function;
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
      width: '100%',
      height: 'auto',
      minHeight: '400px',
      value: this.props.contents,
      imageMultipleFile: true,
      previewTemplate: `
                <div style="width:auto; max-width:1136px; min-height:400px; margin:auto;">
                {{contents}}
                </div>
            `,
      buttonList: [
        ['undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['paragraphStyle', 'blockquote'],
        ['bold', 'underline', 'italic', 'strike'],
        ['fontColor', 'hiliteColor', 'textStyle'],
        ['removeFormat'],
        ['outdent', 'indent'],
        ['align', 'horizontalRule', 'list', 'lineHeight'],
        ['link', 'image'],
        ['fullScreen', 'showBlocks', 'codeView'],
        ['preview'],
      ],
    }));

    editor.onBlur = () => {
      if (typeof this.props.onBlur === 'function') this.props.onBlur(editor.getContents());
    };

    editor.onChange = (contents?: string) => {
      if (typeof this.props.onChange === 'function') this.props.onChange(contents);
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
