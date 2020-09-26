import * as React from 'react';
import { colors } from 'varyd-utils';

import styles from './index.module.scss';

export default class ProjectCard extends React.Component {

  onClick = (e) => {

    const { project } = this.props;

    window.location.hash = `#/project/${project.id}`;

  }

  getWeightedProjectColors(count) {

    const {
      beads,
      project
    } = this.props;

    let weighted = [];

    project.design.forEach(({ color }) => {
      if (!!color?.length) {
        const wColor = weighted.find((c) => c.color === color);
        if (wColor) {
          wColor.count++;
        } else {
          weighted.push({
            color,
            count: 1
          })
        }
      }
    });

    weighted.sort((a, b) => b.count - a.count);

    if (weighted.length < 2) {
      weighted = weighted.concat(weighted);
    }

    const totalCount = weighted.reduce((sum, wc) => sum + wc.count, 0);

    weighted = weighted.map((wc) => ({
      ...wc,
      perc: wc.count / totalCount
    }))

    return weighted.slice(0, count)

  }

  getBgStyle() {

    const weightedColors  = this.getWeightedProjectColors(3),
          gradientStyle   = this.getBgGradient(weightedColors),
          isBgBright      = this.colorsAreBright(weightedColors),
          textShadowColor = isBgBright ? `rgba(255, 255, 255, 0.25)` : `rgba(0, 0, 0, 0.25)`;

    return {
      backgroundImage: gradientStyle,
      color: isBgBright ? 'black' : 'white',
      textShadow: `1px 1px 0 ${textShadowColor}`
    };

  }

  getBgGradient(weightedColors) {

    let style   = `linear-gradient(to bottom right, `,
        accPerc = 0;

    weightedColors.forEach((wc, index) => {

      accPerc += wc.perc;
      style   += `${wc.color}`;

      if (index < weightedColors.length - 1) {
        style += `, ${Math.round(accPerc * 100)}%, `
      }

    });

    style += `)`;

    return style;

  }

  colorsAreBright(weightedColors, threshold = 0.75) {

    const avg = weightedColors.reduce((sum, wc) => {

      const color      = colors.fromHex(wc.color),
            brightness = colors.brightness(color);

      return sum + (brightness * wc.perc);

    }, 0);

    return avg > threshold;

  }

  render() {

    const {
      project
    } = this.props;

    return (
      <li
        className={styles.wrap}
        onClick={this.onClick}
        style={this.getBgStyle()}>

        <p>{project.name}</p>

      </li>

    );

  }

}
