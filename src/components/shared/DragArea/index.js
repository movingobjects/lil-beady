
import * as React from 'react';

export default class DragArea extends React.Component {

  constructor() {

    super();

    this.elemRef = React.createRef();
    this.touch   = null;

  }

  onMouseStart = (e) => {

    this.start(-1, e.clientX, e.clientY);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseEnd);

  };
  onMouseMove = (e) => {

    this.move(-1, e.clientX, e.clientY);

  };
  onMouseEnd = (e) => {

    this.end(-1, e.clientX, e.clientY);

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseEnd);

  };

  onTouchStart = (e) => {

    const { identifier, clientX, clientY } = e.changedTouches[0];

    this.start(identifier, clientX, clientY);

    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onTouchEnd);

  };
  onTouchMove = (e) => {

    const { identifier, clientX, clientY } = e.changedTouches[0];

    if (this.touch && identifier === this.touch.id) {
      this.move(identifier, clientX, clientY);
    }

  };
  onTouchEnd = (e) => {

    const { identifier, clientX, clientY } = e.changedTouches[0];

    if (this.touch && identifier === this.touch.id) {
      this.end(identifier, clientX, clientY);

      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onTouchEnd);
    }

  };

  start(id, clientX, clientY) {

    const { x, y } = this.getPt(clientX, clientY);
    const { onDragStart, minDragDist = 5 } = this.props;

    this.touch = {
      id,
      dragged: minDragDist ? false : true,
      startX: x,
      startY: y,
      x,
      y,
      dx: 0,
      dy: 0,
    };

    if (!minDragDist) {
      if (typeof onDragStart === 'function') {
        onDragStart(this.touch);
      }
    }

  }
  move(id, clientX, clientY) {

    if (!this.touch) return;
    if (id !== this.touch.id) return;

    const { onDragStart, onDrag, minDragDist = 5 } = this.props;
    const { dragged, startX, startY } = this.touch;

    const { x, y } = this.getPt(clientX, clientY);

    const dx = x - startX;
    const dy = y - startY;
    const draggedX = Math.abs(dx) > minDragDist;
    const draggedY = Math.abs(dy) > minDragDist;

    if (!dragged && (draggedX || draggedY)) {
      this.touch = {
        ...this.touch,
        dragged: true,
        startX: x,
        startY: y,
        x,
        y,
        dx: 0,
        dy: 0,
      };

      if (typeof onDragStart === 'function') {
        onDragStart(this.touch);
      }
    } else if (dragged) {
      this.touch = {
        ...this.touch,
        x,
        y,
        dx,
        dy,
      };

      if (typeof onDrag === 'function') {
        onDrag(this.touch);
      }
    }

  }
  end(id, clientX, clientY) {

    if (!this.touch) return;
    if (id !== this.touch.id) return;

    const { onDragEnd } = this.props;
    const { dragged, startX, startY } = this.touch;

    const { x, y } = this.getPt(clientX, clientY);

    this.touch = {
      ...this.touch,
      x,
      y,
      dx: x - startX,
      dy: y - startY,
    };

    if (dragged) {
      if (typeof onDragEnd === 'function') {
        onDragEnd(this.touch);
      }
    }

    this.touch = null;

  }

  getPt(clientX, clientY) {

    const rect = this.elemRef.current.getBoundingClientRect();

    return {
      x: clientX - rect.x,
      y: clientY - rect.y
    };

  }

  render() {

    const {
      x, y,
      w, h,
      children,
      className
    } = this.props;

    return (
      <div
        ref={this.elemRef}
        className={className}
        style={{
          left: x,
          top: y,
          width: w,
          height: h
        }}
        onMouseDown={this.onMouseStart}
        onTouchStart={this.onTouchStart}>

        {children}

      </div>
    );

  }

}
