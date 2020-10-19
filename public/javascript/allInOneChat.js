const allChat = document.querySelectorAll(".single-anchor");

allChat.forEach((chat) => {
	const url = chat.getAttribute("link");
	chat.addEventListener("click", (e) => {
		$.ajax({
			type: "get",
			url: url,
			success: function (response) {
				const data = JSON.stringify(response);
				$("#detail_chat").empty();
				$("#detail_chat").append(constructChat(response));
			},
			error: function (err) {
				alert(
					`Opps something went wrong in the server side, please try again later, err: ${err.message}`
				);
			},
		});
	});
});

const constructChat = (chat) => {
	let c = "";
	c += `<div id="newChatBox" >
	        <input type="text" id="room" value="${chat.id}" hidden />
	        <input type="text" id="user_two_avatar" value="${
						chat.user_two.avatar
					}" hidden/>
	<div>
        <header style="text-align: center; border-bottom: 1px solid #000;">
            ${chat.user_two.user}
			<span id="status"></span>
		</header>
        <main id="chatbody">
        ${constructLineChat(chat)}
		</main>
	</div>
	<div class="chatFooter">
		<form id="chatForm">
			<input type="text" id="send_user" value="${chat.user.id}" hidden />
			<input type="text" id="to_user" value="${chat.user_two.id}" hidden />
			<input type="text" id="user_one_avatar" value="${chat.user.avatar}" hidden />
            <input type="text" name="msg" id="chatinput" required />
            <button type="submit" id="send-btn"> Send </button>
		</form>
	</div>
</div>`;
	return c;
};

const constructLineChat = (chat) => {
	let a = "";
	chat.chat.forEach((msg) => {
		if (msg.send_user == chat.user.id) {
			a += `<li style="text-align: right;">
                <span class="send">${msg.line_chat}</span>
                <img class="chat_avatar" src="${chat.user.avatar}" />
            </li>`;
		} else {
			a += `<li style="text-align: left;">
                <img class="chat_avatar" src="${chat.user_two.avatar}" />
                <span class="receive">${msg.line_chat}</span>
        </li>`;
		}
	});
	return a;
};
