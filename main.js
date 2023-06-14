// run at Breakpoint focused on `e.fetchRetweetedBy`
// Developer tools -> Network -> Filter URLs (Retweeters) -> Stack Trace -> fetchRetweetedBy
(async (tweet_id) => {
  const users = [];
  let cursor = undefined;
  let count = 20;
  let data_cursor = '';
  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  const fetchRetweetedBy = async (tweet_id, cursor, count) => {
    console.log({ tweet_id, cursor, count });
    const results = await e.graphQL(
      s(),
      {
        tweetId: tweet_id,
        count: count,
        cursor,
        includePromotedContent: !0,
        ...(0, i.d)(t)
      },
      (
        (e, t) => {
          var n;
          return !(null != t && null != (n = t.retweeters_timeline) && n.timeline)
        }
      )
    );
    console.log(results);
    return results;
  }

  const data = await fetchRetweetedBy(tweet_id, cursor, count);
  console.log(data);
  data_cursor = data.retweeters_timeline.timeline.instructions[0].entries.filter((e) => (e.entryId.startsWith('cursor-bottom-')))[0].content.value;
  console.log({ cursor, data_cursor });
  if (`${cursor}` == `${data_cursor}`) return;
  cursor = data_cursor;
  data.retweeters_timeline.timeline.instructions[0].entries.filter((e) => (e.entryId.startsWith('user-'))).map((e) => (e.content.itemContent.user_results.result)).forEach((u) => (users.push(u)));

  do {
    await sleep(500);
    console.log(cursor);
    const data = await fetchRetweetedBy(tweet_id, cursor, count);
    console.log(data);
    data_cursor = data.retweeters_timeline.timeline.instructions[0].entries.filter((e) => (e.entryId.startsWith('cursor-bottom-')))[0].content.value;
    console.log({ cursor, data_cursor });
    if (`${cursor}` == `${data_cursor}`) {
      count--;
      if (count > 0) continue;
      break;
    }
    cursor = data_cursor;
    data.retweeters_timeline.timeline.instructions[0].entries.filter((e) => (e.entryId.startsWith('user-'))).map((e) => (e.content.itemContent.user_results.result)).forEach((u) => {if(!users.filter((_u)=>(`${_u?.rest_id}` == `${u?.rest_id}`)).length) users.push(u)});
    
  } while (typeof cursor != 'undefined')
	const randomNumber = () => (Number(`${Math.random()}`.split('.')[1]));
  const randomIndex = () => (
		randomNumber() %
		users.length
	)
  console.log(users[Number(randomIndex())]);
})('<TWEET_ID_HERE>')
