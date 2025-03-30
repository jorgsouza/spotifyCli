import { formatTime } from '../utils/formatTime.js';

export class TrackPosition {
  constructor(positionMicroseconds, totalMicroseconds) {
    this.position = positionMicroseconds || 0;
    this.total = totalMicroseconds || 0;
  }
  
  get formattedPosition() {
    return formatTime(this.position);
  }
  
  get formattedTotal() {
    return formatTime(this.total);
  }
  
  get formattedString() {
    return `${this.formattedPosition}/${this.formattedTotal}`;
  }
  
  get percentComplete() {
    if (this.total === 0) return 0;
    return Math.floor((this.position / this.total) * 100);
  }
}
