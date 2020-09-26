import * as React from 'react';
import { colors } from 'varyd-utils';

import styles from './index.module.scss';

export default class ProjectCard extends React.Component {

  onClick = (e) => {

    const { project } = this.props;

    window.location.hash = `#/project/${project.id}`;

  }

  getBgColors(count = 2) {

    const {
      beads,
      project
    } = this.props;

    const weightedColors = [];

    project.design.forEach(({ color }) => {
      if (!!color?.length) {
        const wColor = weightedColors.find((c) => c.color === color);
        if (wColor) {
          wColor.count++;
        } else {
          weightedColors.push({
            color,
            count: 1
          })
        }
      }
    });

    let bgColors = weightedColors
      .sort((a, b) => b.count - a.count)
      .map((wc) => wc.color)
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
