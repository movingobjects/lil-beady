
import * as React from 'react';

export default class DragArea extends React.Component {

  constructor(props) {

    super(props);

    this.elemRef = React.createRef();
    this.touchId = null;

  }

  onMouseStart = (e) => {

    this.touchId = 0;

    const {
      onDragStart
    } = this.props;

    if (typeof onDragStart === 'function') {
      const pt = this.toAreaPt(e.clientX, e.clientY);
      onDragStart(pt.x, pt.y);
    }

    this.startMouseEvents();

  }
  onMouseMove = (e) => {

    if (this.touchId !== null) {

      const {
        onDrag
      } = this.props;

      if (typeof onDrag === 'function') {
        const pt = this.toAreaPt(e.clientX, e.clientY);
        onDrag(pt.x, pt.y);
      }

    }

  }
  onMouseEnd = (e) => {

    this.endMouseEvents();

    const {
      onDragEnd
    } = this.props;

    if (typeof onDragEnd === 'function') {
      const pt = this.toAreaPt(e.clientX, e.clientY);
      onDragEnd(pt.x, pt.y);
    }

    this.touchId = null;

  }

  startMouseEvents() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseEnd);
  }
  endMouseEvents() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseEnd);
  }

  onTouchStart = (e) => {

    this.startTouchEvents();

    const touch = e.changedTouches[0];

    this.touchId = touch.identifier;

    const {
      onDragStart
    } = this.props;

    if (typeof onDragStart === 'function') {
      const pt = this.toAreaPt(touch.clientX, touch.clientY);
      onDragStart(pt.x, pt.y);
    }

  }
  onTouchMove = (e) => {

    if (this.touchId !== null) {

      const {
        onDrag
      } = this.props;

      if (typeof onDrag === 'function') {

        // TODO: should this check the touch for the same touchId?
        const touch = e.changedTouches[0],
              pt    = this.toAreaPt(touch.clientX, touch.clientY);

        onDrag(pt.x, pt.y);

      }

    }

  }
  onTouchEnd = (e) => {

    this.endTouchEvents();

    const {
      onDragEnd
    } = this.props;

    if (typeof onDragEnd === 'function') {

      const touch = e.changedTouches[0],
            pt    = this.toAreaPt(touch.clientX, touch.clientY);

      onDragEnd(pt.x, pt.y);

    }

    this.touchId = null;

  }

  startTouchEvents() {
    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onTouchEnd);
  }
  endTouchEvents() {
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }

  toAreaPt(clientX, clientY) {

    const {
      layoutArea
    } = this.props;

    return {
      x: clientX - layoutArea.x,
      y: clientY - layoutArea.y
    };

  }

  render() {

    const {
      children,
      className
    } = this.props;

    return (
      <div
        ref={this.elemRef}
        className={className}
        onMouseDown={this.onMouseStart}
        onTouchStart={this.onTouchStart}>

        {children}

      </div>
    );

  }

}
