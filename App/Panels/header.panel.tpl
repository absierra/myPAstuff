{*<header>
	<img src="/Resources/core/img/{$delphi_city_name}_logo.png" alt="Delphi Performance"/><span class="logo-text">Budgets</span>
</header>*}
<header style="background-image: url('/Resources/core/img/logos/{$delphi_city_name}_logo.png'); border-color: {$color};">
    <div id="navlinks">
	    <ul>
		    <li{if $panel == 'index'} class="active">Explore the Budget{else}><a href="/">Explore the Budget</a>{/if}</li>
		    <li{if $panel == 'about'} class="active">About the Budget{else}><a href="/about">About the Budget</a>{/if}</li>
		    <li{if $panel == 'how_to'} class="active">How To{else}><a href="/how_to">How To</a>{/if}</li>
		    <li{if $panel == 'test'} class="active">test{else}><a href="/test">test</a>{/if}</li>
		</ul>
    </div>
</header>
