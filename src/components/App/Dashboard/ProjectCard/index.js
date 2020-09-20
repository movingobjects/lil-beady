import * as React from 'react';
import { colors } from 'varyd-utils';

import styles from './index.module.scss';

export default class ProjectCard extends React.Component {

  onClick = (e) => {

    const { id } = this.props;

    window.location.hash = `#/project/${id}`;

  }

  getBgColors(count = 2) {

    const {
      beads,
      project
    } = this.props;

    const weightedBeads = [];

    project.design.forEach(({ beadId }) => {
      if (!!beadId?.length) {
        const wBead = weightedBeads.find((b) => b.id === beadId);
        if (wBead) {
          wBead.count++;
        } else {
          weightedBeads.push({
            id: beadId,
            count: 1
          })
        }
      }
    });

    let bgColors = weightedBeads
      .sort((a, b) => b.count - a.count)
      .map((b) => beads[b.id]?.color)
      .filter((c) => !!c);

    if (!bgColors.length) {
      bgColors = ['white'];
    }

    while (bgColors.length < count) {
      bgColors = bgColors.concat(bgColors);
    }

    return bgColors.slice(0, count);

  }

  colorsAreBright(bgColors, threshold = 0.75) {

    const total = bgColors.reduce((sum, cur) => {

      const color = colors.fromHex(cur),
            brightness = colors.brightness(color);

      return sum + brightness;

    }, 0);

    const avg = total / bgColors.length;

    return avg > threshold;

  }

  render() {

    const {
      project
    } = this.props;

    const bgColors        = this.getBgColors(2),
          isBgBright      = this.colorsAreBright(bgColors),
          textShadowColor = isBgBright ? `rgba(255, 255, 255, 0.25)` : `rgba(0, 0, 0, 0.25)`;

    return (
      <li
        className={styles.wrap}
        onClick={this.onClick}
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${bgColors.join(', ')})`,
          color: isBgBright ? 'black' : 'white',
          textShadow: `1px 1px 0 ${textShadowColor}`
        }}>

        <p>{project.name}</p>

      </li>

    );

  }

}
