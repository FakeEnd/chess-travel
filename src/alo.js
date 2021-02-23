let X,Y,finished,visited,chessboard

export const alo = (x, y,m,n) => {
    X = x//纵轴长度row
    Y = y//横轴长度col
    finished = false
    visited = Array(X * Y).fill(false)
    chessboard = new Array(X);
    for (let index = 0; index < X; index++) {
        chessboard[index] = new Array(Y);
        for (let i = 0; i < Y; i++) {
            chessboard[index][i] = 0;
        }
    }
    traversalChessboard(chessboard, m, n, 1)
    return chessboard
}

const traversalChessboard = (chessboard, row, column, step) => {
    chessboard[row][column] = step;
    visited[row * Y + column] = true;// 标记该位置已访问
    // 获取当前位置可以走的下一步
    let ps = next(row, column);
    // 对ps进行非递减排序，
    ps.sort((s1, s2) => {
        let count1 = next(s1.x, s1.y).length;
        let count2 = next(s2.x, s2.y).length;
        if (count1 < count2) {
            return -1;
        } else if (count1 == count2) {
            return 0;
        } else {
            return 1;
        }
    });
    // console.log(ps)
    // 遍历ps
    while (ps.length > 0) {
        let p = ps[0]
        ps.shift();// 取出下一个可以走的位置

        // 判断是否访问过
        if (visited[p.x * Y + p.y] == false) {// 说明还没有访问过
            traversalChessboard(chessboard, p.x, p.y, step + 1);
        }
    }
    // 判断是否完成
    if (finished == true) {
        return;
    }
    if (step < X * Y) {
        chessboard[row][column] = 0;
        visited[row * Y + column] = false;
        return;
    } else {
        finished = true
    }

}

const dx = [1, 2, 2, 1, -1, -2, -2, -1];
const dy = [2, 1, -1, -2, -2, -1, 1, 2];
//下一步可以走的位置
const next = (x, y) => {
    let arr = []
    for (let i = 0; i < 8; i++) {
        if (isExist(x + dx[i], y + dy[i])) {
            arr.push({ x: x + dx[i], y: y + dy[i] })
        }
    }
    return arr;
}
//这个位置是否可以存在使用
const isExist = (x, y) => {
    if (x < 0 || x > X - 1 || y < 0 || y > Y - 1) return false;
    return true
}
