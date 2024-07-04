// Priority Queue Implementation
class PriorityQueue {
        constructor() {
          this.queue = [];
        }
      
        // Function to maintain heap property on adding a new element
        upheapify(idx) {
          if (idx === 0) return;
          let parent_idx = Math.floor((idx - 1) / 2);
          if (this.queue[parent_idx].val < this.queue[idx].val) {
            // Swap current element with its parent
            let temp = this.queue[idx];
            this.queue[idx] = this.queue[parent_idx];
            this.queue[parent_idx] = temp;
            this.upheapify(parent_idx);
          }
        }
      
        // Function to maintain heap property on removing the root element
        downheapify(idx) {
          let left_child = 2 * idx + 1;
          let right_child = 2 * idx + 2;
          if (left_child >= this.queue.length && right_child >= this.queue.length) return;
          let swap_idx = idx;
          if (left_child < this.queue.length && this.queue[swap_idx].val < this.queue[left_child].val) {
            swap_idx = left_child;
          }
          if (right_child < this.queue.length && this.queue[swap_idx].val < this.queue[right_child].val) {
            swap_idx = right_child;
          }
          if (swap_idx === idx) return;
          // Swap current element with the larger child
          let temp = this.queue[idx];
          this.queue[idx] = this.queue[swap_idx];
          this.queue[swap_idx] = temp;
          this.downheapify(swap_idx);
        }
      
        // Function to check if the priority queue is empty
        empty() {
          return this.queue.length === 0;
        }
      
        // Function to add a new element to the priority queue
        push(val, name) {
          this.queue.push({ val: val, name: name });
          this.upheapify(this.queue.length - 1);
        }
      
        // Function to remove and return the root element from the priority queue
        pop() {
          if (this.queue.length === 0) return null;
          let top = this.queue[0];
          let last = this.queue.pop();
          if (this.queue.length > 0) {
            this.queue[0] = last;
            this.downheapify(0);
          }
          return top;
        }
      
        // Function to get the root element without removing it
        top() {
          return this.queue[0];
        }
}

export default PriorityQueue;